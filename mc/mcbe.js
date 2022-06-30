/* needs loaded:
zip.js
zip-fs.js
z-worker.js in same folder
aes2.js
*/


zip.configure({
    workerScripts: {
        deflate: ["z-worker.js"],
    }
});

const SKIN_KEY = "s5s5ejuDru4uchuF2drUFuthaspAbepE";

const _mcbe_utils = {
    string_to_bytes: function(text) {
        const bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
        return bytes;
    },
    get_file: function(folder, name) {
        let dirs = name.split("/"); 
        for(let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            folder = folder.getChildByName(dir);
            if(i == dirs.length - 1)
                return folder;
        }
    },
    blob_dl: function(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        return a;
    },
    decrypt_cfb: async function(ciphertext, key) {
        if(typeof key == "string")
            key = _mcbe_utils.string_to_bytes(key);
        if(!(ciphertext instanceof Uint8Array))
            ciphertext = new Uint8Array(ciphertext);

        let label = "decrypt "+ ciphertext.length + " bytes " + ciphertext[0];

        if(ciphertext.length > 10000) { // small files are better with low latency instead of high cpu usage
            let w = new Worker("mc/decrypt_worker.js");
            return new Promise((resolve, reject) => {
                w.onmessage = (e) => {
                    if(e.data.plaintext) {
                        window.decryptedTotal ++;
						window.updateDecryptStatus();
						resolve(e.data.plaintext);
                        w.terminate();
                    }
                };
                w.postMessage({ciphertext, key});
            });
        }

        // fallback
        let cipher = new AES(key);
        let _shiftRegister = Array.from(key.slice(0,16));
        let plaintext = ciphertext.slice(0);

        // CFB mode
        for(let i = 0; i < plaintext.byteLength; i++) {
            plaintext[i] ^= cipher.encrypt(_shiftRegister);
            _shiftRegister.shift();
            _shiftRegister.push(ciphertext[i]);
        }

		window.decryptedTotal ++;
		window.updateDecryptStatus();

        return plaintext;
    }
}

class MarketplaceDecryptor {
    _key;
    type;
    constructor(key, status_cb) {
        if(typeof key == "string")
            key = _mcbe_utils.string_to_bytes(key);
        this._key = key;
        this.type = "unknown";
        this.status = status_cb;
    }

    /**
     * decrypt contents.json and world files
     * @param {*} buf 
     * @returns 
     */
    async WorldOrContentsJsonDecrypt(buf) {
        const dv = new DataView(buf);
		
		if(buf.byteLength <= 0x100){
			return buf;
		}
        const version = dv.getUint32(0, true);
        const magic = dv.getUint32(4, true);
        let unk = dv.getBigUint64(8, true);
        if (magic != 0x9bcfb9fc || version != 0) {
            return buf;
        }
        let td = new TextDecoder();
        const name = td.decode(buf.slice(16,16+36));
    
        return await _mcbe_utils.decrypt_cfb(buf.slice(0x100), this._key);
    }

    /**
     * decrypt and parse a contents.json
     * @param {*} folder 
     * @returns 
     */
    async decrypt_contents_json(folder) {
        const contents_file = folder.getChildByName("contents.json");
        const buf = await (await contents_file.getBlob()).arrayBuffer();
        const dec = await this.WorldOrContentsJsonDecrypt(buf);
        const td = new TextDecoder();
        const json = td.decode(dec);
        try {
            const data = JSON.parse(json);
            await contents_file.replaceText(JSON.stringify(data, null, 2));
            return data;
        } catch(e) {
            throw new Error("likely wrong key");
        }
    }

    /**
     * decrypts a folder with contents.json in it
     * @param {*} folder 
     */
    async decrypt_Contents(folder) {
        return new Promise(async(resolve, reject) => {
            // decrypt contents.json
            const data = await this.decrypt_contents_json(folder).catch(reject);
            if(!data) return;
			window.totalFiles = data.content.length;
            let _decrypt_content = async (content) => {
                if(!content.key)
                    return;
                const content_file = _mcbe_utils.get_file(folder, content.path);
                const data = await (await content_file.getBlob()).arrayBuffer();
                const dec = await _mcbe_utils.decrypt_cfb(data, content.key);
                await content_file.replaceBlob(new Blob([dec]));
            };

            await Promise.all(data.content.map(_decrypt_content));
            resolve();
        });
    }

    /**
     * decrypt second layer zip
     * @param {*} folder 
     * @returns 
     */
    async decrypt_inner_zip(folder) {
        return new Promise(async(resolve, reject) => {
            // for skins
            const contents_file = folder.getChildByName("contents.json");
            if(contents_file) { // texturepack or skin pack
                this.type = "skin"; // FIXME add  texturepack
                this.status("decrypting");
				
				window.decryptedTotal = 0;
				
				await this.decrypt_Contents(folder).catch(reject);

				// Decrypt any sub-packs
                const subpacks_folder = folder.find("subpacks");
				if(subpacks_folder) {
                    for(const subpack of subpacks_folder.children) {
						window.decryptedTotal = 0;
                        this.status("decrypting sub pack: "+subpack.name);
                        await this.decrypt_Contents(subpack).catch(reject);
                    }
                }

				
				const skins_file = folder.find("skins.json");
				if(skins_file) {
					this.status("Cracking skins");
					let str = await skins_file.getText();
					await skins_file.replaceText(str.replaceAll("paid", "free"));
					//type = "skin";
				}
                
            }
            else
            { // worlds
                const behavior_packs_folder = folder.find("behavior_packs");
                window.decryptedTotal = 0;
				if(behavior_packs_folder) {
                    for(const behavior_pack of behavior_packs_folder.children) {
                        this.status("decrypting behavior pack: "+behavior_pack.name);
                        await this.decrypt_Contents(behavior_pack).catch(reject);
                    }
                }
                window.decryptedTotal = 0;
                const resourcepacks_folder = folder.find("resource_packs");
                if(resourcepacks_folder) {
                    for(const resource_pack of resourcepacks_folder.children) {
                        this.status("decrypting resource pack: "+resource_pack.name);
                        await this.decrypt_Contents(resource_pack).catch(reject);
                    }
                }

				window.decryptedTotal = 0;
                const db_folder = folder.find("db");
                if(db_folder) {
                    this.status("decrypting world data...");
					window.totalFiles = db_folder.children.length;
                    let _dec = async(file) => {
						if(file.directory)
							return;
                        const data = await (await file.getBlob()).arrayBuffer();
                        let buf = await this.WorldOrContentsJsonDecrypt(data);
                        await file.replaceBlob(new Blob([buf]));
                    };
                    await Promise.all(db_folder.children.map(_dec))
                    .catch(reject);
                }

                const leveldat_file = folder.find("level.dat");
                if(leveldat_file) {
                    this.status("Cracking world...");
                    let buf = await leveldat_file.getUint8Array();
                    // find "prid" in the uint8array
                    let i_prid = buf.findIndex((v, i) => {
                        return v == 0x70 && buf[i+1] == 0x72 && buf[i+2] == 0x69 && buf[i+3] == 0x64;
                    });
                    buf[i_prid] = 0x61; // a
                    await leveldat_file.replaceUint8Array(buf);
                    this.type = "world";
                }
				
            }
            resolve();
        });
    }

    /**
     * decrypt a marketplace zip
     * @param {*} blob 
     * @returns 
     */
    async decrypt(blob) {
        const fs = new zip.fs.FS();
        await fs.importBlob(blob);
        for(let entry of fs.entries) {
            if(!entry.name)
                continue
            const fs2 = new zip.fs.FS();
            await fs2.importBlob(await entry.getBlob());
            await this.decrypt_inner_zip(fs2);
            this.status("zipping "+entry.name);
            await entry.replaceBlob(await fs2.exportBlob({level: 0}));
        }
        this.status("creating zip");
        let ret = await fs.exportBlob({level: 0});
        this.status("done");
        return ret;
    }
}

function status_cb(str) {
        statusElem = document.getElementById("d2");
        statusElem.innerHTML = '<a id="dlStatus" href="javascript:void"><img src="/images/icon-loading.gif" /> '+str+'</a>';
}
decryptedTotal = 0;
totalFiles = 0;
function updateDecryptStatus(){
	if(totalFiles == 0)
		status_cb("Decrypted: "+decryptedTotal.toString()+" files.");
	else
		status_cb("Decrypting: "+Math.floor(decryptedTotal/totalFiles*100).toString()+"%");
}

function downloadNoOrigin(url){
	var htmlbody = '';
	// no referrer plz
	htmlbody += '<meta name="referrer" content="no-referrer" />';
	
	// Create script tag
	htmlbody += '<script>';
	
	// Script to execute
	htmlbody += 'console.log("Hi microsoft, what do you think of this neat trick? :D");';
	htmlbody += 'var xhr = new XMLHttpRequest();';
	htmlbody += 'xhr.open("GET", "'+url+'", true);';
	htmlbody += 'xhr.responseType = "blob";'
	
	htmlbody += 'xhr.onprogress = function(e) { parent.postMessage({"Type": "Progress", "Value": Math.round(e.loaded/e.total*100) }, "*"); };';
	htmlbody += 'xhr.onload = function(e) { parent.postMessage({"Type": "Complete", "Value": xhr.response}, "*"); };';
	htmlbody += 'xhr.send();';
	
	// Create closing script
	htmlbody += '</script>';


	// This is considered origin "null"
	// thus no orign is sent to the server, and we WIN!
	uri = 'data:text/html,'+htmlbody;

	document.getElementById("downloadFrame").src = uri;

}



let _download_lock = false;
function download_and_decrypt(url, key, keyId, filename) {
    if(_download_lock) {
        alert("download already in progress");
        return;
    }
    _download_lock = true;
	window.downloadFileName = filename;
	window.downloadKeyId = keyId;
    

    status_cb("Starting download...");
	downloadNoOrigin(url);
	/*
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.onprogress = function(e) {
        status_cb("Downloading: "+Math.round(e.loaded/e.total*100)+"%");
    };

	*/
	
	window.addEventListener('message', async function(evt) {
		if(evt.data.Type == "Progress"){
			status_cb("Downloading: "+evt.data.Value.toString()+"%");
		}
		if(evt.data.Type == "Complete") {

		  /*xhr.onload = async function(e) {
			if(xhr.status != 200) {
				alert("error downloading: "+xhr.status);
				_download_lock = false;
				return;
			}
		  */
			status_cb("Unpacking...");
			var arc = new zip.ZipReader(new zip.BlobReader(evt.data.Value));
			var entries = await arc.getEntries();

			for(var i = 0; i < entries.length; i++) {
				var entry = entries[i];
				const blob2 = await entry.getData(new zip.BlobWriter())
				const fs = new zip.fs.FS();
				await fs.importBlob(blob2);
				
				var manifest = fs.getChildByName("manifest.json");
				var txt = await manifest.getText();
				var manifestJson = JSON.parse(txt);
				var uuid = manifestJson.header.uuid;
				
				if(uuid == window.downloadKeyId) {
					let decryptor = new MarketplaceDecryptor(key, status_cb);
					 await decryptor.decrypt_inner_zip(fs);
					
					status_cb("Repacking...");
					var zipBlob = await fs.exportBlob({level: 0, compressionMethod:0});
					
					// Workaround chrome on android bug.
					var mcPackBlob = zipBlob.slice(0, zipBlob.size, "application/octlet-stream")

					var blobUrl = URL.createObjectURL(mcPackBlob);
					
					// Download plz
					status_cb("Done! (click here if the download didnt start!)")
					document.getElementById("dlStatus").href = blobUrl;
					document.getElementById("dlStatus").download = window.downloadFileName;
					if(!navigator.userAgent.toLowerCase().indexOf("safari") != -1)
						document.getElementById("dlStatus").click();
				}
			}
			
			_download_lock = false;
		}
		
	});


//	xhr.send();
}

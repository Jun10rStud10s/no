/* needs loaded:
aesjs
zip.js
zip-fs.js

z-worker.js in same folder
*/


zip.configure({
    workerScripts: {
        deflate: ["z-worker.js"],
    }
});

/**
 * the key storage ( not used yet )
 */
const SKIN_KEY = aesjs.utils.utf8.toBytes("s5s5ejuDru4uchuF2drUFuthaspAbepE");
const KEYS = {};
async function get_key(guid) {
    if(KEYS[guid]) {
        return KEYS[guid];
    }
    console.log("dont have key");
    return false;
}

/**
 * pad buffer to 16 bytes
 * @param {ArrayBuffer} buf 
 * @returns {ArrayBuffer}
 */
function pad_buf_16(buf) {
    const pad_len = 16 - (buf.byteLength % 16);
    const pad = new Uint8Array(pad_len);
    const padded = new Uint8Array(buf.byteLength + pad_len);
    padded.set(new Uint8Array(buf), 0);
    padded.set(pad, buf.byteLength);
    return padded;
}

/**
 * decrypt contents.json
 * @param {Blob} blob encrypted file
 * @param {Uint8Array} key the aes key
 * @returns {Promise<ArrayBuffer>} decrypted content
 */
async function WorldOrContentsJsonDecrypt(blob, key) {
    let buf = await blob.arrayBuffer();
    const dv = new DataView(buf);
	
	if(buf.byteLength <= 0x10){
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

    const ciphertext = new Uint8Array(buf.slice(0x100));
    const aesCfb = new aesjs.ModeOfOperation.cfb(key, key.slice(0,16), 1);
    const decrypted = aesCfb.decrypt(ciphertext);
    return decrypted.slice(0, buf.byteLength);
}

/**
 * decrypt and parse contents.json
 * @param {Blob} blob 
 * @returns {Promise<Object>}
 */
async function decrypt_contents_json(blob, key) {
    const dec = await WorldOrContentsJsonDecrypt(blob, key);
    const td = new TextDecoder();
    const json = td.decode(dec);
    const data = JSON.parse(json);
    return data;
}

/**
 * get file from zip
 * @param {*} folder 
 * @param {string} name 
 * @returns 
 */
function get_file(folder, name) {
    let dirs = name.split("/"); 
    for(let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        folder = folder.getChildByName(dir);
        if(i == dirs.length - 1)
            return folder;
    }
}

/**
 * decrypt a folder with contents.json in it
 * @param {*} folder zip folder
 * @param {Uint8Array} key aes key
 */
async function decryptContents(folder, key) {

    // decrypt contents.json
    const contents_file = folder.getChildByName("contents.json");
    const data = await contents_file.getBlob().then((blob) => decrypt_contents_json(blob, key));
    const new_content = new Blob([JSON.stringify(data, null, 2)]);
    await contents_file.replaceBlob(new_content);
    delete key;

    // decrypt all encrypted files
    for(const content of data.content) {
        if(content.key) {
            // get content
            const content_file = get_file(folder, content.path);
			status_cb("Decrypting: "+content.path);
            const blob = await content_file.getBlob();
			const buf = await blob.arrayBuffer();
            const ciphertext = pad_buf_16(buf);
            // decrypt
            const key = aesjs.utils.utf8.toBytes(content.key);
            const aesCfb = new aesjs.ModeOfOperation.cfb(key, key.slice(0, 16), 1);
            const decrypted = aesCfb.decrypt(ciphertext)
            // replace
            const content_blob = new Blob([decrypted.slice(0, buf.byteLength)]);
            await content_file.replaceBlob(content_blob);
        }
    }
}

/**
 * decrypt the marketplace content zip
 * @param {Blob} blob
 * @returns {Promise<Blob>}
 */


function status_cb(str){
	statusElem = document.getElementById("d2");
	statusElem.innerHTML = '<a id="dlStatus" href="javascript:void"><img src="/images/icon-loading.gif" /> '+str+'</a>';
}

isDownloading = false;



async function decrypt_mcbe(blob, key=SKIN_KEY, index, downloadName="a.zip") {
	
    if(typeof key == "string") { // user error
        key = aesjs.utils.utf8.toBytes(key);
    }

    if(!status_cb) {
        status_cb = (msg) => {
            console.log(msg);
        }
    }

    return new Promise(async(resolve, reject) => {
        let type;
        // open first level zip
        const arc = new zip.ZipReader(new zip.BlobReader(blob));
        const entries = await arc.getEntries();
        const entry = entries[index];
        // open second level zip
        const blob2 = await entry.getData(new zip.BlobWriter())
        const fs = new zip.fs.FS();
        await fs.importBlob(blob2);
    
        // for skins and resource packs
        const contents_file = fs.getChildByName("contents.json");
        if(contents_file) { // texturepack or skin pack
            type = "resourcepack";
            status_cb("Decrypting: ");
            await decryptContents(fs, key);
        
			const skins_file = fs.find("skins.json");
            if(skins_file) {
                let str = await skins_file.getText();
                await skins_file.replaceText(str.replaceAll("paid", "free"));
                type = "skin";
            }
		}
        else 
        { // worlds
            // world
            status_cb("Decrypting: behavior_packs/");
            const behavior_packs_folder = fs.find("behavior_packs");
            if(behavior_packs_folder) {
                for(const behavior_pack of behavior_packs_folder.children)
                    await decryptContents(behavior_pack, key);
            }
            
            status_cb("Decrypting: resource_packs/");
            const resourcepacks_folder = fs.find("resourcepacks");
            if(resourcepacks_folder) {
                for(const resource_pack of resourcepacks_folder.children)
                    await decryptContents(resource_pack, key);
            }
    
            
            const db_folder = fs.find("db");
            if(db_folder) {
                for(const db of db_folder.children) {
                    status_cb("Decrypting: db/"+db.name);
					if(db.directory)
						continue;
                    let buf = await WorldOrContentsJsonDecrypt(await db.getBlob(), key);
                    await db.replaceBlob(new Blob([buf]));
                }
            }

			status_cb("Cracking...");
			
            // this is fast it doesnt need a status line
            const leveldat_file = fs.find("level.dat");
            if(leveldat_file) {

                let buf = await leveldat_file.getUint8Array();
                // find "prid" in the uint8array
                let i_prid = buf.findIndex((v, i) => {
                    return v == 0x70 && buf[i+1] == 0x72 && buf[i+2] == 0x69 && buf[i+3] == 0x64;
                });
                buf[i_prid] = 0x61; // a
                await leveldat_file.replaceUint8Array(buf);
                type = "world";
            }
		
        }

        status_cb("Repacking...");
        const ret_blob = await fs.exportBlob({"level": 0, "compressionMethod":0});
		
		// Download plz
		var blobUrl = URL.createObjectURL(ret_blob);
		status_cb("Done! (click here if the download didnt start!)")
		document.getElementById("dlStatus").href = blobUrl;
		document.getElementById("dlStatus").download = downloadName;
		document.getElementById("dlStatus").click();
		
		isDownloading = false;
        resolve([ret_blob, type]);
		
    });
}

// BEGIN UI


function add_blob_dl_link(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.text = "download " + name;
    a.download = name;
    document.body.appendChild(a);
}


// TESTING
/*
(async () => {
    const resp = await fetch("https://xforgeassets002.xboxlive.com/serviceid-18231953-4b1d-472c-a39e-48b10105b7b7/e467bf5a-0261-47f7-aabe-2bb680d7d982/SkinPack_DayoftheDead.zip");
    const [z,_] = await decrypt_mcbe(await resp.blob());
    add_blob_dl_link(z, "SkinPack_DayoftheDead.zip");
})();
*/

// TESTING
(async () => {
    show_status("downloading template from marketplace");
    const resp = await fetch("https://xforgeassets001.xboxlive.com/pf-title-b63a0803d3653643-20ca2/67d2c04e-1a99-49c5-b9c2-d56c8fa8586d/primary.zip");
    let key = aesjs.utils.utf8.toBytes("cO2xYGn8Mcev1NRNAjftzo2ZncYYxoSB");
    const [z,_] = await decrypt_mcbe(await resp.blob(), key, show_status);
    console.log(z);
    add_blob_dl_link(z, "world.mctemplate");
});




const status_elem = document.getElementById("status");
const show_status = (msg) => {
    console.log(msg);
    document.getElementById("status").innerText += msg + "\n";
};
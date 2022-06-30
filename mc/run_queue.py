import io
import requests
import mariadb
import time
import zipfile
import json
import zlib

from Crypto.Cipher import AES

conn = None
cur = None

def DbConnect():
    global conn
    global cur
    conn = mariadb.connect(
        user="root",
        password="kingofitall413",
        host="127.0.0.1",
        port=3306,
        database="tpb",
        autocommit=True
    )
    cur = conn.cursor()
    

def TryDecrypt(Ciphertext, Key, KeyId):
    UUID = Ciphertext[0x11:0x35].decode("UTF-8")
    print(UUID)
    if UUID != KeyId:
        return False
        
    Iv = Key[:0x10]
    print(Iv)
    print(Key)
    Cipher = AES.new(bytes(Key, "ascii"), AES.MODE_CFB, bytes(Iv, "ascii"))
    Plaintext = Cipher.decrypt(Ciphertext[0x100:])
    
    # Check if valid JSON
    try:
        print(json.loads(Plaintext))
        return True
    except Exception as e:
        print(e)
        pass
    
    # Check if valid LevelDB
    try:
        dec = zlib.decompress(Plaintext, -15)
        open("test.ldb", "wb").write(dec)
        if dec[:0x4] == b"\x00\x11\x01\x00":
            return True
    except Exception as e:
        print(e)
        pass
    
    return False
def CheckKeyInZip(ZipData, KeyId, KeyData):
    with zipfile.ZipFile(io.BytesIO(ZipData),"r") as outerZip:
        for outZFileName in outerZip.namelist():
            if outZFileName.endswith(".zip"):
                with outerZip.open(outZFileName) as outZFile:
                    with zipfile.ZipFile(outZFile, "r") as innerZip:
                        print(outZFile)
                        # Check KeyId Matches in manifest.json
                        with innerZip.open('manifest.json') as manifest:
                            if json.loads(manifest.read())['header']['uuid'] != KeyId:
                                continue
                            
                        # Verify Contents.json
                        for InnerZipName in innerZip.namelist():
                            print(InnerZipName)
                            if InnerZipName.endswith("contents.json"): # Resource Packs, Skin Packs, Etc
                                with innerZip.open(InnerZipName) as file:
                                    return TryDecrypt(file.read(), KeyData, KeyId)
                            elif InnerZipName.endswith(".ldb"): # Worlds
                                with innerZip.open(InnerZipName) as file:
                                    return TryDecrypt(file.read(), KeyData, KeyId)
    return False


def AddKeyToDatabase(KeyId, KeyData):
    cur.execute("UPDATE contentskeys SET KeyData=? WHERE KeyId=? AND KeyData='UNKNOWN'", (KeyData, KeyId))

def UpdateAddedDate(ContentId):
    cur.execute("UPDATE contents SET DateAdded=? WHERE Id=?", (int(time.time()), ContentId))


def GetUrlIdForKey(KeyId):
    cur.execute("SELECT UrlId FROM contentsmodules WHERE KeyId=?", (KeyId,))
    return cur.fetchone()[0]
    
def GetContentIdFromKey(KeyId):
    cur.execute("SELECT ContentId FROM contentskeys WHERE KeyId=?", (KeyId,))
    return cur.fetchone()[0]


def GetUrl(UrlId):
    cur.execute("SELECT Url FROM contentsurls WHERE UrlId=?", (UrlId,))
    return cur.fetchone()[0]
    
def GetKeyUrl(KeyId):
    return GetUrl(GetUrlIdForKey(KeyId))
    
    
def QueueHasItems():
    cur.execute("SELECT COUNT(*) FROM contentsqueue")
    return cur.fetchone()[0] > 0
    
def PopTopQueue(pop=True):
    cur.execute("SELECT * FROM contentsqueue LIMIT 1")
    KeyId, KeyData = cur.fetchone()
    if pop:
        cur.execute("DELETE FROM contentsqueue WHERE KeyId=? AND KeyData=? LIMIT 1", (KeyId, KeyData))
    return (KeyId, KeyData)
    
while True:
    DbConnect() # Make sure were connected
    if QueueHasItems():
        KeyId, KeyData = PopTopQueue()
        ContentId = GetContentIdFromKey(KeyId)
        Url = GetKeyUrl(KeyId)
        print("Downloading: "+Url)
        r = requests.get(Url)
        if CheckKeyInZip(r.content, KeyId, KeyData):
            print("Real Key! Adding to database!")
            AddKeyToDatabase(KeyId, KeyData)
            UpdateAddedDate(ContentId)
        else:
            print("Fake Key!")
        
    time.sleep(5) # Wait 5 secs before reading again
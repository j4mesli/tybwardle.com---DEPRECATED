import json
import random
import ftplib

with open('today.json', 'r', encoding="utf8") as obj:
    newChar = json.load(obj)
    print(newChar)

with open('characters.json', 'r', encoding="utf8") as chars:
    characters = json.load(chars)

output = characters[random.randint(0, len(characters) - 1)]
while output == newChar:
    output = characters[random.randint(0, len(characters) - 1)]

with open('today.json', 'w', encoding='utf8') as today:
    json.dump(output, today, ensure_ascii=False)

ftpkeys = open('tybwkeys.txt', 'r').read().splitlines()
user = ftpkeys[0]
password = ftpkeys[1]
host = ftpkeys[2]
port = ftpkeys[3]

ftps = ftplib.FTP_TLS()
ftps.connect(host, int(port))
# Output: '220 Server ready for new user.'
ftps.login(user, password)
# Output: '230 User usr logged in.'
directoryList = ftps.nlst()
for i in directoryList:
    if i == "today.json":
        ftpDelete = ftps.delete("today.json")
file = open('today.json', 'rb')
ftps.storbinary('STOR today.json', file)
directoryList = ftps.nlst()
print(directoryList)
ftps.quit()

import * as os from 'os';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { createSelection } from 'bun-promptx'
import readline from 'readline';
import * as figlet from 'figlet';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getUser() {
    console.log(figlet.textSync('D E F R O', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    }));    return new Promise((resolve) => {
        rl.question(`[kolejność: imię potem nazwisko] \n Podaj swoje imię i nazwisko: `, (answer) => {            resolve(answer); 
            rl.close(); 
        });
    });
}
function getCpuInfo() {
    const cpus = os.cpus();
    const cpuModel = cpus[0].model.trim();
    const amdPattern = /(Ryzen\s[3579]\s\d{4}[A-Z]?[XGU]?)/;
    const intelPattern = /(i[3579])-?(\d{3,4}[A-Z]?[KFGTUH]?)/;  

    const amdMatch = cpuModel.match(amdPattern);
    if (amdMatch) {
        return amdMatch[0];  
    }

    const intelMatch = cpuModel.match(intelPattern);
    if (intelMatch) {
        return `${intelMatch[1]} ${intelMatch[2]}`;  
    }

    return cpuModel;
}

async function getSerialNumber() {
    const data = await si.system();
    return data.serial || 'Unknown';
}

function getRamInfo() {
    const totalMemory = os.totalmem(); 
    const totalMemoryGB = Math.ceil(totalMemory / (1024 ** 3)); 
    return `${totalMemoryGB}GB`;
}

async function getDiskSize() {
    const data = (await si.diskLayout()) as unknown as any[];

    const totalDiskSize = data.reduce((sum, disk) => sum + disk.size, 0);
    const totalDiskSizeGB = totalDiskSize / (1024 ** 3); 


    const standardSizesGB = [128, 256, 512, 1024, 2048, 3072, 4096, 6144, 8192]; 

    function findNearestSize(targetSize: number, standardSizes: number[]): number {
        return standardSizes.reduce(
            (closestSize, size) => Math.abs(size - targetSize) < Math.abs(closestSize - targetSize) ? size : closestSize
        );
    }
 
    const nearestDiskSize = findNearestSize(totalDiskSizeGB, standardSizesGB);

    if (nearestDiskSize >= 1024) {
        return `${nearestDiskSize / 1024}T`;
    } else {
        return `${nearestDiskSize}GB`;
    }
}

async function getProducerInfo() {
    const data = await si.system();
    return data.manufacturer.split(' ')[0] || 'Unknown';
}

async function getModelInfo() {
    const data = await si.system();
    return data.model || 'Unknown';
}

async function getFamily() {
    const data = await si.system();
    return data.model.split(' ')[0] || 'Unknown';
}

function getOsVersion() {
    const version = os.release();
    const build = version.split('.')[2]; 
    if (version.startsWith('10.0') && parseInt(build, 10) >= 22000) {
        return 'Windows 11';
    } else {
        return `Windows ${version}`;
    }
}

async function getPcData() {
    const host = os.hostname();
    const sn = await getSerialNumber();
    const cpu = getCpuInfo();
    const ram = getRamInfo();
    const disk = await getDiskSize();
    const producent = await getProducerInfo();
    const model = await getModelInfo();
    const family = await getFamily();
    const os_version = getOsVersion();
    const user = await getUser();


    const pcData = {
        host,
        sn,
        cpu,
        ram,
        producent,
        model,
        family,
        disk,
        os_version,
        user
    };

    return pcData;
}

const pcData = await getPcData();

async function savePcDataToFile(data: typeof pcData) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(`${pcData.host}.json`, jsonData);
}

console.log(pcData);

const sendDataToServer = async (data: typeof pcData) => {
    fetch('http://localhost:5000/device', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: '//TODO: identification of this device ',
            data: pcData,
        })
    }).then(response => response.json()).then(data => console.log(data)).catch(error => console.error(error));
}


// savePcDataToFile(pcData);




const valid = prompt("Is this okey? (y/N)", "y");

if(valid == "y") {
    sendDataToServer(pcData);
}

// sendDataToServer(pcData);
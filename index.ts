import * as os from 'os';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { createSelection } from 'bun-promptx'
import readline from 'readline';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getUser() {
    return new Promise((resolve) => {
        rl.question('Podaj swoje imię i nazwisko: ', (answer) => {
            resolve(answer); 
            rl.close(); 
        });
    });
}

function getCpuInfo() {
    const cpus = os.cpus();
    return cpus[0].model.split(' ').pop();
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
    const data = (await si.diskLayout() ) as unknown as any[];

    const totalDiskSize = data.reduce((sum, disk) => sum + disk.size, 0);
    const totalDiskSizeGB = Math.ceil(totalDiskSize / 1024 ** 3);
    let roundDiskSize
    if (totalDiskSizeGB >= 440 && totalDiskSize <= 520) { roundDiskSize = 512}
    else if (totalDiskSizeGB >= 220 && totalDiskSize <= 250) { roundDiskSize = 256}
    else if (totalDiskSizeGB >= 370 && totalDiskSize <= 400) { roundDiskSize = 400}
    else if (totalDiskSizeGB >= 450 && totalDiskSize <= 490) { roundDiskSize = 512}
    else if (totalDiskSizeGB >= 890 && totalDiskSize <= 1000) { roundDiskSize = 960}
    else {roundDiskSize = totalDiskSizeGB}
    return `${roundDiskSize}GB`;

    
    
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
    if (version.startsWith('10') && build >= 22000) {
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
    fetch('http://10.2.40.111:2137/device', {
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
import * as os from 'os';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { createSelection } from 'bun-promptx'

// Funkcja do pobierania informacji o CPU
function getCpuInfo() {
    const cpus = os.cpus();
    return cpus[0].model; // Zwraca model pierwszego procesora
}

// Funkcja do uzyskania numeru seryjnego systemu
async function getSerialNumber() {
    const data = await si.system();
    return data.serial || 'Unknown';
}

// Funkcja do pobierania rozmiaru RAM
function getRamInfo() {
    const totalMemory = os.totalmem(); // w bajtach
    const totalMemoryGB = Math.ceil(totalMemory / (1024 ** 3)); // Przeliczenie na GB i zaokrąglenie
    return `${totalMemoryGB} GB`;
}

// Funkcja do pobierania rozmiaru dysku
async function getDiskSize() {
    const data = (await si.diskLayout() ) as unknown as any[];

    const totalDiskSize = data.reduce((sum, disk) => sum + disk.size, 0);
    const totalDiskSizeGB = Math.ceil(totalDiskSize / 1024 ** 3);
    return `${totalDiskSizeGB} GB`;
}

// Funkcja do pobierania informacji o producencie
async function getProducerInfo() {
    const data = await si.system();
    return data.manufacturer || 'Unknown';
}

// Funkcja do pobierania informacji o modelu
async function getModelInfo() {
    const data = await si.system();
    return data.model || 'Unknown';
}

// Funkcja do uzyskania wersji systemu operacyjnego
function getOsVersion() {
    const version = os.release();
    const build = version.split('.')[2]; // Użycie trzeciej części wersji jako build
    if (version.startsWith('10') && build >= 22000) {
        return 'Windows 11';
    } else {
        return `Windows ${version}`;
    }
}

// Główna funkcja do zebrania wszystkich danych
async function getPcData() {
    const host = os.hostname();
    const sn = await getSerialNumber();
    const cpu = getCpuInfo();
    const ram = getRamInfo();
    const disk = await getDiskSize();
    const producent = await getProducerInfo();
    const model = await getModelInfo();
    const family = 'Unknown';
    const os_version = getOsVersion();

    const pcData = {
        host,
        sn,
        cpu,
        ram,
        producent,
        model,
        family,
        disk,
        os_version
    };

    return pcData;
}

const pcData = await getPcData();


// Zapis danych do pliku JSON
async function savePcDataToFile(data: typeof pcData) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(`${pcData.host}.json`, jsonData);
}

console.log(pcData);

const sendDataToServer = async (data: typeof pcData) => {
    fetch('http://192.168.78.33:2137/device', {
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

// Uruchomienie programu
// savePcDataToFile(pcData);

// const valid = prompt("Is this okey? (y/N)", "y");

// if(valid == "y") {
//     sendDataToServer(pcData);
// }

sendDataToServer(pcData);
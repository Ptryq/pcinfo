import fetch from 'node-fetch'; // Jeśli używasz Bun, to może nie być potrzebne, ale dla Node.js potrzebne
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Funkcje pomocnicze do generowania losowych danych
const getRandomCpu = () => {
    const cpus = ["i3 1115G4", "i5 1235U", "i7 1165G7", "Ryzen 5 5600U", "Ryzen 7 5800U"];
    return cpus[Math.floor(Math.random() * cpus.length)];
};

const getRandomRam = () => {
    const ramOptions = ["8GB", "16GB", "32GB", "64GB"];
    return ramOptions[Math.floor(Math.random() * ramOptions.length)];
};

const getRandomDisk = () => {
    const diskOptions = ["256GB SSD", "512GB SSD", "1TB SSD", "1TB HDD"];
    return diskOptions[Math.floor(Math.random() * diskOptions.length)];
};

const getRandomOsVersion = () => {
    const osVersions = ["Windows 10", "Windows 11", "Ubuntu 22.04", "Fedora 38", "macOS Ventura"];
    return osVersions[Math.floor(Math.random() * osVersions.length)];
};

const getRandomUser = (index: number) => {
    const users = ["patryk palacz", "anna kowalska", "jan nowak", "mateusz lis", "karolina zielińska"];
    return `${users[Math.floor(Math.random() * users.length)]}-${index}`;
};

// Generowanie 100 losowych urządzeń
async function generateDevices() {
    const devices = [];

    for (let i = 0; i < 100; i++) {
        const deviceData = {
            host: `device-host-${i}`,
            sn: uuidv4(),  // Losowy UUID jako numer seryjny
            cpu: getRandomCpu(),
            ram: getRandomRam(),
            producent: "Dell",  // Możesz tutaj dodać więcej losowych producentów
            model: "Latitude 3540",
            family: "Latitude",
            disk: getRandomDisk(),
            os_version: getRandomOsVersion(),
            user: getRandomUser(i)
        };

        devices.push(deviceData);

        try {
            await sendDeviceToServer(deviceData);
        } catch (error) {
            console.error(`Błąd przy wysyłaniu urządzenia: ${deviceData.sn}`, error);
        }
    }

    console.log('Wszystkie urządzenia zostały wygenerowane i wysłane.');
}

// Wysyłanie danych urządzenia do serwera
async function sendDeviceToServer(device: any) {
    const response = await fetch('http://192.168.0.103:5000/device', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: device.sn,
            data: device
        })
    });

    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(`Urządzenie ${device.sn} zostało zapisane.`, responseData);
}

// Uruchamianie procesu generowania urządzeń
generateDevices().catch(console.error);

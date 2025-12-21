// save.js - API для сохранения игры
const fs = require('fs');
const path = require('path');

// Путь к файлу сохранений
const SAVES_FILE = path.join(__dirname, 'saves.json');

// Убеждаемся, что файл существует
function ensureSavesFile() {
    if (!fs.existsSync(SAVES_FILE)) {
        fs.writeFileSync(SAVES_FILE, JSON.stringify({}));
    }
}

// Обработчик сохранения
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, gameData } = req.body;

        if (!userId || !gameData) {
            return res.status(400).json({ error: 'Missing userId or gameData' });
        }

        ensureSavesFile();

        // Читаем текущие сохранения
        let saves = {};
        try {
            const fileContent = fs.readFileSync(SAVES_FILE, 'utf8');
            saves = JSON.parse(fileContent);
        } catch (error) {
            // Если файл поврежден, создаем новый
            saves = {};
        }

        // Обновляем сохранение пользователя
        saves[userId] = {
            data: gameData,
            timestamp: Date.now(),
            lastUpdated: new Date().toISOString()
        };

        // Сохраняем обратно
        fs.writeFileSync(SAVES_FILE, JSON.stringify(saves, null, 2));

        res.status(200).json({ 
            success: true, 
            message: 'Game saved successfully',
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
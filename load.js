// load.js - API для загрузки игры
const fs = require('fs');
const path = require('path');

// Путь к файлу сохранений
const SAVES_FILE = path.join(__dirname, 'saves.json');

// Обработчик загрузки
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Проверяем существование файла
        if (!fs.existsSync(SAVES_FILE)) {
            return res.status(404).json({ error: 'No saves found' });
        }

        // Читаем сохранения
        const fileContent = fs.readFileSync(SAVES_FILE, 'utf8');
        const saves = JSON.parse(fileContent);

        // Возвращаем сохранение пользователя
        if (saves[userId]) {
            res.status(200).json(saves[userId].data);
        } else {
            res.status(404).json({ error: 'User save not found' });
        }
    } catch (error) {
        console.error('Error loading game:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
import messageModel from '../models/messages.models.js';

export default class ChatManager {
    async saveMessage(user, message) {
        try {
            // Guardar el mensaje en MongoDB
            const newMessage = new messageModel({ user, message });
            await newMessage.save();
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
            throw error;
        }
    }

    async getAllMessages() {
        try {
            // Obtener todos los mensajes de MongoDB
            const messages = await messageModel.find();
            return messages;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
            throw error;
        }
    }
}
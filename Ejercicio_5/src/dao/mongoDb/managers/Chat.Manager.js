const messageModel = require("../models/messages.models");

class ChatManager {
    async saveMessage(text, user) {
      try {
        await message.create({ text, user });
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        throw error;
      }
    }
  
    async getAllMessages() {
      try {
        const message = await messageModel.find({});
        return await message.find();
      } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        throw error;
      }
    }
  }
  
  module.exports = ChatManager;
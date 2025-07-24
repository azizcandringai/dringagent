export const languages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    code: 'en',
    translations: {
      title: 'AI Chatbot',
      placeholder: 'Type your message...',
      send: 'Send',
      darkMode: 'Toggle dark mode',
      language: 'Language',
      welcome: 'Hello! How can I help you today?',
      botTyping: 'Bot is typing...',
      errorMessage: 'Sorry, I encountered an error. Please try again.',
      defaultBotResponse: 'Thanks for your message! This is a demo chatbot. How else can I assist you?'
    }
  },
  es: {
    name: 'Español',
    flag: '🇪🇸', 
    code: 'es',
    translations: {
      title: 'Chatbot IA',
      placeholder: 'Escribe tu mensaje...',
      send: 'Enviar',
      darkMode: 'Alternar modo oscuro',
      language: 'Idioma',
      welcome: '¡Hola! ¿Cómo puedo ayudarte hoy?',
      botTyping: 'El bot está escribiendo...',
      errorMessage: 'Lo siento, encontré un error. Por favor, inténtalo de nuevo.',
      defaultBotResponse: '¡Gracias por tu mensaje! Este es un chatbot de demostración. ¿En qué más puedo ayudarte?'
    }
  },
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
    code: 'tr', 
    translations: {
      title: 'AI Sohbet Botu',
      placeholder: 'Mesajınızı yazın...',
      send: 'Gönder',
      darkMode: 'Karanlık modu aç/kapat',
      language: 'Dil',
      welcome: 'Merhaba! Bugün size nasıl yardımcı olabilirim?',
      botTyping: 'Bot yazıyor...',
      errorMessage: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
      defaultBotResponse: 'Mesajınız için teşekkürler! Bu bir demo sohbet botudur. Başka nasıl yardımcı olabilirim?'
    }
  }
};

export type LanguageCode = keyof typeof languages;
export type Translation = typeof languages.en.translations;
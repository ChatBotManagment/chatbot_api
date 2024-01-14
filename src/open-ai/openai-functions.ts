export const openAiFunctions = (message) => [
  {
    name: 'summarize',
    type: 'summarization', // Type of function
    params: {
      query: message,
      max_length: 100,
    },
  },
  {
    name: 'translate',
    type: 'translation',
    params: {
      text: message,
      target_language: 'ar',
    },
  },
];

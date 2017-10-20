const originalEmojis = {
  '👍': '👍',
  '👎': '👎',
  '😄': '😄',
  '🎉': '🎉',
  '😕': '😕',
  '❤️': '❤️'
}

//chrome.storage.sync.set({ emojis: originalEmojis });

// Fetch the set emojis and set them if they have been customized
chrome.storage.sync.get("emojis", function(items) {
  if (!chrome.runtime.error) {
    const merged = Object.assign({}, originalEmojis, items.emojis);
    console.log(merged);
    Array.from(document.querySelectorAll('.emoji')).forEach(emoji => {
      emoji.textContent = merged[emoji.textContent];
      emoji.addEventListener('click', () => {
        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendMessage(tab.id, {
            originalEmoji: emoji.getAttribute('data-original-emoji'),
            currentEmoji: emoji.textContent
          });
        })
      });
    });
  } else {
    console.log(chrome.runtime.error)
  }
});

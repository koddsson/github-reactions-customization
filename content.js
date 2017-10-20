let emojiReplacements = null;
// Read this from `chrome.storage.sync`
chrome.storage.sync.get("emojis", function(items) {
  if (!chrome.runtime.error) {
		emojiReplacements = items.emojis;

		// Loop the first time over all the emojis and change the markup to be how we want it
  	const allEmojis = document.querySelectorAll('.emoji')
  	Array.from(allEmojis).forEach(emoji => {
  	  if (emojiReplacements[emoji.textContent]) {
  	    emoji.setAttribute('data-original-emoji', emoji.textContent)
  	    emoji.textContent = emojiReplacements[emoji.textContent]
  	  }
  	})
	}
});

const changeEmojisOnPage = () => {
  const allEmojis = document.querySelectorAll('.emoji')
  Array.from(allEmojis).forEach(emoji => {
		const originalEmoji = emoji.getAttribute('data-original-emoji');
    if (emojiReplacements[originalEmoji]) {
      emoji.textContent = emojiReplacements[originalEmoji];
    }
  })
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Figure out what emoji this is supposed to be replacing
    // Ask the user for the new emoji
    const newEmoji = prompt(`What would you like to replace ${request.currentEmoji} with?`);
		// Save new emoji to chrome.storage.sync
		emojiReplacements[request.originalEmoji] = newEmoji;
		chrome.storage.sync.set({ emojis: emojiReplacements });
    // Re-render from new state
    changeEmojisOnPage();
  }
)


const observer = new MutationObserver(function(mutations) {
	const allEmojis = document.querySelectorAll('.emoji.mr-1:not([data-original-emoji])');

	if (allEmojis.length) {
		const form = allEmojis[0].parentElement.parentElement.parentElement;
		observer.observe(form, {childList: true});
	}
  Array.from(allEmojis).forEach(emoji => {
    if (emojiReplacements[emoji.textContent]) {
      emoji.setAttribute('data-original-emoji', emoji.textContent);
      emoji.textContent = emojiReplacements[emoji.textContent];
    }
	});
});

for(const reaction of document.querySelectorAll('.js-pick-reaction')) {
	observer.observe(reaction, { childList: true });
}
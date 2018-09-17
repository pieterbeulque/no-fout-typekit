/* globals Typekit */
export default ((d) => function loadTypekit(kit) {
	const sessionStorageKey = 'TYPEKIT_LOADED';

	const async = (function shouldLoadAsync() {
		try {
			return window.sessionStorage.getItem(sessionStorageKey) !== kit;
		} catch (e) {
			return true;
		}
	}());

	const html = d.documentElement;

	const fallback = setTimeout(() => {
		html.className = `${html.className.replace(/\bwf-loading\b/g, '')} wf-inactive`;
	}, 3000);

	const typekit = d.createElement('script');

	const firstScript = d.getElementsByTagName('script').item(0);

	let hasLoaded = false;
	let state;

	html.className = `${html.className} wf-loading`;

	typekit.src = `https://use.typekit.net/${kit}.js`;
	typekit.async = async;
	const typekitLoadHandler = function () {
		state = this.readyState;

		if (hasLoaded || (state && state !== 'complete' && state !== 'loaded')) {
			return;
		}

		hasLoaded = true;
		clearTimeout(fallback);
		try {
			Typekit.load({
				async,
				active() {
					window.sessionStorage.setItem(sessionStorageKey, kit);
				},
			});
		} catch (e) {
			window.sessionStorage.removeItem(sessionStorageKey);
		}
	};

	typekit.onload = typekitLoadHandler;
	typekit.onreadystatechange = typekitLoadHandler;

	firstScript.parentNode.insertBefore(typekit, firstScript);
})(document);

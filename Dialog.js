/**
 * Диалоговое окно.
 * @version 2024-01-29
 */
class Dialog {

	static #isActive = false;
	static #isModal = false;
	static #callback = null;

	static dialogClass = "myDialog";
	static modalBlockerClass = "myModalBlocker";
	static buttonsContainerClass = "buttonsContainer";
	static closeButtonClass = "closeButton";

	/** Возвращает логическое значение, указывающее, открыт ли диалог в данный момент. */
	static get isActive() {
		return this.#isActive;
	}

	/**
	 * Показывает диалог.
	 * @param {string} id Значение атрибута id.
	 * @param {boolean} modal Определяет, должен ли диалог быть модальным.
	 * @param {string} content Содержимое диалога.
	 * @param {?string} header Текст заголовка или null для создания диалога без заголовка.
	 * @param {object} buttons Объект с данными кнопок в формате { значение: "надпись" }.
	 * @param {Function} callback
	 * Функция, вызываемая при нажатии одной из кнопок.
	 * Единственным параметром в нее передается значение нажатой кнопки.
	 * @param {number} width Ширина окна.
	 * @param {number} height Высота окна.
	 */
	static show(id, modal, content, header, buttons, callback, width, height) {
		if (typeof modal != "boolean")
			throw new TypeError("Параметр modal должен быть типа boolean.");
		if (buttons && typeof buttons != "object")
			throw new TypeError("Параметр buttons должен быть типа object.");
		if (callback && !callback instanceof Function)
			throw new TypeError("Параметр callback должен быть функцией.");
		if (width && typeof width != "number")
			throw new TypeError("Параметр width должен быть типа number.");
		if (height && typeof height != "number")
			throw new TypeError("Параметр height должен быть типа number.");

		if (this.#isActive) {
			console.log("Диалог уже открыт.");
			return;
		}

		this.#isModal = modal;
		this.#callback = callback;

		let headerCode = "", buttonsCode = "", styleCode = "";

		if (header) {
			headerCode = `<header>${header}<div class="${this.closeButtonClass}" title="Закрыть" data-value="#close"><svg width="16" height="16" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="m 12,10.047142 q 0,0.3367 -0.235692,0.572383 l -1.144783,1.144783 Q 10.383842,12 10.047142,12 9.7104417,12 9.47475,11.764308 L 7,9.289558 4.52525,11.764308 Q 4.2895583,12 3.9528583,12 3.6161583,12 3.380475,11.764308 L 2.2356917,10.619525 Q 2,10.383842 2,10.047142 2,9.710442 2.2356917,9.47475 L 4.7104417,7 2.2356917,4.52525 Q 2,4.2895583 2,3.9528583 2,3.6161583 2.2356917,3.380475 L 3.380475,2.2356917 Q 3.6161583,2 3.9528583,2 4.2895583,2 4.52525,2.2356917 L 7,4.7104417 9.47475,2.2356917 Q 9.7104417,2 10.047142,2 q 0.3367,0 0.572383,0.2356917 L 11.764308,3.380475 Q 12,3.6161583 12,3.9528583 12,4.2895583 11.764308,4.52525 L 9.2895583,7 11.764308,9.47475 Q 12,9.710442 12,10.047142 z"/></svg></div></header>`;
		}

		if (buttons) {
			buttonsCode = `<div class="${this.buttonsContainerClass}">`;
			for (let key in buttons)
				buttonsCode += `<button data-value="${key}">${buttons[key]}</button>`;
			buttonsCode += '</div>';
		}

		if (width || height) {
			let styles= [];
			if (width)
				styles.push(`--width: ${width}px;`);
			if (height)
				styles.push(`--height: ${height}px;`);
			styleCode = ` style="${styles.join(" ")}"`;
		}

		let idAttr = id ? `id="${id}"` : "";
		let html = `<div ${idAttr} class="${this.dialogClass}"${styleCode}>${headerCode}<main>${content}${buttonsCode}</main></div>`;
		if (modal)
			html = `<div class="${this.modalBlockerClass}">${html}</div>`;

		document.body.insertAdjacentHTML("beforeend", html);
		setTimeout(() => document.addEventListener("click", this.#documentClickHandler), 0);
		this.#isActive = true;
	}

	/** Закрывает диалог. */
	static hide() {
		if (!this.#isActive) return;
		document.querySelector("." + (this.#isModal ? this.modalBlockerClass : this.dialogClass)).remove();
		document.removeEventListener("click", this.#documentClickHandler);
		this.#isActive = false;
	}

	static #documentClickHandler = (event) => {
		let target = event.target;
		if (target.closest("." + this.dialogClass)) {
			if (target.tagName == "BUTTON" || target.matches("." + this.closeButtonClass)) {
				let hide = true;
				if (Dialog.#callback)
					hide = Dialog.#callback(target.dataset.value);
				if (hide !== false)
					Dialog.hide();
			}
		}
		else if (!Dialog.#isModal)
			Dialog.hide();
	};
}

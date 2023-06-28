class Dialog {

	static #isActive = false;
	static #isModal = false;
	static #callback = null;

	/** Возвращает логическое значение, указывающее, открыт ли диалог в данный момент. */
	static get isActive() {
		return this.#isActive;
	}

	/**
	 * Показывает диалог.
	 * @param {boolean} modal Определяет, должен ли диалог быть модальным.
	 * @param {string} content Содержимое диалога.
	 * @param {object} buttons Объект с данными кнопок в формате { значение: "надпись" }.
	 * @param {Function} callback
	 * Функция, вызываемая при нажатии одной из кнопок.
	 * Единственным параметром в нее передается значение нажатой кнопки.
	 * @param {number} width Ширина окна.
	 * @param {number} height Высота окна.
	 */
	static show(modal, content, buttons, callback, width, height) {
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

		let buttonsCode = "", styleCode = "";

		if (buttons)
			for (let key in buttons)
				buttonsCode += `<button data-value="${key}">${buttons[key]}</button>`;

		if (width || height) {
			let styles= [];
			if (width)
				styles.push(`--width: ${width}px;`);
			if (height)
				styles.push(`--height: ${height}px;`);
			styleCode = ` style="${styles.join(" ")}"`;
		}

		let html = `<div class="myDialog"${styleCode}>${content}${buttonsCode}</div>`;
		if (modal)
			html = `<div class="myModalBlocker">${html}</div>`;

		document.body.insertAdjacentHTML("beforeend", html);
		document.addEventListener("click", this.#documentClickHandler);
		this.#isActive = true;
	}

	/** Закрывает диалог. */
	static hide() {
		if (!this.#isActive) return;
		document.querySelector(this.#isModal ? ".myModalBlocker" : ".myDialog").remove();
		document.removeEventListener("click", this.#documentClickHandler);
		this.#isActive = false;
	}

	static #documentClickHandler(event) {
		let target = event.target;
		if (target.closest(".myDialog, .myModalDialog")) {
			if (target.tagName == "BUTTON") {
				if (Dialog.#callback)
					Dialog.#callback(target.dataset.value);
				Dialog.hide();
			}
		}
		else if (!Dialog.#isModal)
			Dialog.hide();
	}
}
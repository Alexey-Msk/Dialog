/**
 * Диалоговое окно.
 * @version 2024-02-01
 */
class Dialog {
// export default class Dialog {

	static #isActive = false;
	static #isModal = false;
	static #callback = null;

	/** Используемые имена классов. */
	static classNames = {
		dialog: "myDialog",
		modalBlocker: "myModalBlocker",
		content: "content",
		buttonsContainer: "buttonsContainer",
		header: "header",
		closeButton: "closeButton",
	};

	/** Минимальная высота содержимого по умолчанию. */
	static minContentHeight = 30;

	/** Возвращает логическое значение, указывающее, открыт ли диалог в данный момент. */
	static get isActive() {
		return this.#isActive;
	}

	/**
	 * Показывает диалог.
	 * @param {string} id Значение атрибута id.
	 * @param {boolean} modal Определяет, должен ли диалог быть модальным.
	 * @param {string} content Содержимое диалога.
	 * @param {object} options Дополнительные параметры.
	 * @param {?string} options.header Текст заголовка или null для создания диалога без заголовка.
	 * @param {object} options.buttons Объект с данными кнопок в формате { значение: "надпись" }.
	 * @param {Function} options.callback
	 * Функция, вызываемая при нажатии одной из кнопок.
	 * Единственным параметром в нее передается значение нажатой кнопки.
	 * @param {number} options.width Ширина окна.
	 * @param {number} options.height Высота окна.
	 * @param {number} options.maxWidth Максимальная ширина окна.
	 * @param {number} options.maxHeight Максимальная высота окна.
	 * @param {number} options.minContentHeight Минимальная высота содержимого.
	 */
	static show(id, modal, content, options = {}) {
		const { header, buttons, callback, width, height, maxWidth, maxHeight, minContentHeight = this.minContentHeight } = options;

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
		if (maxWidth && typeof maxWidth != "number")
			throw new TypeError("Параметр maxWidth должен быть типа number.");
		if (maxHeight && typeof maxHeight != "number")
			throw new TypeError("Параметр maxHeight должен быть типа number.");
		if (typeof minContentHeight != "number")
			throw new TypeError("Параметр minContentHeight должен быть типа number.");

		if (this.#isActive) {
			console.log("Диалог уже открыт.");
			return;
		}

		this.#isModal = modal;
		this.#callback = callback;

		let headerCode = "", buttonsCode = "", styleCode = "";

		if (header) {
			headerCode = `<div class="${this.classNames.header}">${header}<div class="${this.classNames.closeButton}" title="Закрыть" data-value="#close"><svg width="16" height="16" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="m 12,10.047142 q 0,0.3367 -0.235692,0.572383 l -1.144783,1.144783 Q 10.383842,12 10.047142,12 9.7104417,12 9.47475,11.764308 L 7,9.289558 4.52525,11.764308 Q 4.2895583,12 3.9528583,12 3.6161583,12 3.380475,11.764308 L 2.2356917,10.619525 Q 2,10.383842 2,10.047142 2,9.710442 2.2356917,9.47475 L 4.7104417,7 2.2356917,4.52525 Q 2,4.2895583 2,3.9528583 2,3.6161583 2.2356917,3.380475 L 3.380475,2.2356917 Q 3.6161583,2 3.9528583,2 4.2895583,2 4.52525,2.2356917 L 7,4.7104417 9.47475,2.2356917 Q 9.7104417,2 10.047142,2 q 0.3367,0 0.572383,0.2356917 L 11.764308,3.380475 Q 12,3.6161583 12,3.9528583 12,4.2895583 11.764308,4.52525 L 9.2895583,7 11.764308,9.47475 Q 12,9.710442 12,10.047142 z"/></svg></div></div>`;
		}

		if (buttons) {
			buttonsCode = `<div class="${this.classNames.buttonsContainer}">`;
			for (let key in buttons)
				buttonsCode += `<button data-value="${key}">${buttons[key]}</button>`;
			buttonsCode += '</div>';
		}

		if (width || height) {
			let styles = [];
			if (width)
				styles.push(`--width: ${width}px; width: ${width}px;`);
			if (height)
				styles.push(`--height: ${height}px; height: ${height}px;`);
			styleCode = ` style="${styles.join(" ")}"`;
		}
		else if (maxWidth || maxHeight) {
			let styles = [];
			if (maxWidth)
				styles.push(`--max-width: ${maxWidth}px;`);
			if (maxHeight)
				styles.push(`--max-height: ${maxHeight}px;`);
			styleCode = ` style="${styles.join(" ")}"`;
		}

		let idAttr = id ? `id="${id}"` : "";
		let html = `<div ${idAttr} class="${this.classNames.dialog}"${styleCode}>
						<div>
							${headerCode}
							<div class="${this.classNames.content}">${content}</div>
							${buttonsCode}
						</div>
					</div>`;
		if (modal)
			html = `<div class="${this.classNames.modalBlocker}">${html}</div>`;

		document.body.insertAdjacentHTML("beforeend", html);

		let element = document.body.lastElementChild;
		if (modal)
			element = element.firstElementChild;
		const container = element.firstElementChild;
		// container.style.maxHeight = element.clientHeight + "px";

		const updateSizeVariables = () => {
			element.style.setProperty("--width", container.offsetWidth + "px");
			element.style.setProperty("--height", container.offsetHeight + "px");
		}

		const autoSize = !width && !height;
		if (autoSize) {
			// const headerHeight = element.querySelector("." + this.classNames.header)?.offsetHeight;
			// const controlsHeight = element.querySelector("." + this.classNames.buttonsContainer)?.offsetHeight;
			// const minHeight = minContentHeight + (headerHeight ?? 0) + (controlsHeight ?? 0);
			// element.style.minHeight = minHeight + "px";
			updateSizeVariables();
		}

		window.addEventListener("resize", e => {
			// container.style.maxHeight = element.clientHeight + "px";
			if (autoSize) {
				// console.log(container.offsetWidth, container.offsetHeight);
				updateSizeVariables();
			}
		});

		setTimeout(() => document.addEventListener("click", this.#documentClickHandler), 0);
		this.#isActive = true;
	}

	/** Закрывает диалог. */
	static hide() {
		if (!this.#isActive) return;
		document.querySelector("." + (this.#isModal ? this.classNames.modalBlocker : this.classNames.dialog)).remove();
		document.removeEventListener("click", this.#documentClickHandler);
		this.#isActive = false;
	}

	static #documentClickHandler = (event) => {
		let target = event.target;
		if (target.closest("." + this.classNames.dialog)) {
			if (target.tagName == "BUTTON" || target.matches("." + this.classNames.closeButton)) {
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

// import Dialog from "./Dialog.js";

/**
 * Окно сообщения.
 * @version 2025-03-07
 */
class MessageBox
// export default class MessageBox
{
    static elementId = "messageBox";
    static defaultMaxWidth = 600;
    static #dialog = null;

    /**
     * Показывает сообщение.
     * @param {string} content - Содержимое: строка или HTML-код.
     * @param {?string} header - Текст заголовка или null для отображения сообщения без заголовка.
     * @param {object} buttons - Объект с данными кнопок в формате { значение: "надпись" }.
     * @param {number} maxWidth - Максимальная ширина диалога.
     * @returns Объект `Promise`, завершающийся после нажатия любой из кнопок диалога.
     */
    static show(content, header, buttons = { ok: "OK" }, maxWidth = this.defaultMaxWidth)
    {
        return new Promise(resolve =>
            this.#dialog = Dialog.showNew(this.elementId, true, content, { header, buttons, maxWidth, callback: resolve })
        );
    }

    /** Закрывает окно сообщения. */
    static hide()
    {
        this.#dialog.hide();
    }
}

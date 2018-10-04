// ============================================================================================
// Local storage access class/service
// ============================================================================================

/**
 * Manages local storage for a specified key
 * @export
 * @class LocalStorage
 */
export default class LocalStorage {

  constructor (key) {
    // Store proeprties
    this.key = key;    
  }

  /**
   * Stores a value into local-storage
   * @param {*} value Value ot store
   * @memberof LocalStorage
   */
  set (value) {
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }
  
  /**
   * Extracts a value from local storage
   * @returns {any} Extracted value
   * @memberof LocalStorage
   */
  get () {
    return JSON.parse(window.localStorage.getItem(this.key));
  }

  /**
   * Clears local storage value
   * @memberof LocalStorage
   */
  clear () {
    window.localStorage.removeItem(this.key);
  }

  /**
   * Performs an update on the value in local storage
   * @param {*} callbackFn Function performing a value update: (currentValue) => { return updatedValue; }
   * @memberof LocalStorage
   */
  update (callbackFn) {
    const currentValue = this.get(),
          updatedValue = callbackFn(currentValue);
    this.set(updatedValue);
  }

}

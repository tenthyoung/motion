import { camelToDash } from "../../render/dom/utils/camel-to-dash"
import { MotionValue } from "../../value"
import { MotionValueState } from "../MotionValueState"
import { createSelectorEffect } from "../utils/create-dom-effect"
import { createEffect } from "../utils/create-effect"

export const addAttrValue = (
    element: HTMLElement | SVGElement,
    state: MotionValueState,
    key: string,
    value: MotionValue
) => {
    return state.set(key, value, () => {
        const v = state.latest[key]
        if (v === null || v === undefined) {
            element.removeAttribute(camelToDash(key))
        } else {
            element.setAttribute(camelToDash(key), String(v))
        }
    })
}

export const attrEffect = createSelectorEffect(createEffect(addAttrValue))

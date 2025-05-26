import { MotionValue } from "../../value"
import { addAttrValue } from "../attr"
import { MotionValueState } from "../MotionValueState"
import { addStyleValue } from "../style"
import { createSelectorEffect } from "../utils/create-dom-effect"
import { createEffect } from "../utils/create-effect"

const addSVGValue = (
    element: SVGElement,
    state: MotionValueState,
    key: string,
    value: MotionValue
) => {
    const handler = key in element.style ? addStyleValue : addAttrValue
    return handler(element, state, key, value)
}

export const svgEffect = /*@__PURE__*/ createSelectorEffect(
    /*@__PURE__*/ createEffect(addSVGValue)
)

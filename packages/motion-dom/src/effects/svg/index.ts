import { frame } from "../../frameloop"
import { MotionValue } from "../../value"
import { px } from "../../value/types/numbers/units"
import { addAttrValue } from "../attr"
import { MotionValueState } from "../MotionValueState"
import { addStyleValue } from "../style"
import { createSelectorEffect } from "../utils/create-dom-effect"
import { createEffect } from "../utils/create-effect"

const toPx = px.transform!

function addSVGPathValue(
    element: SVGElement,
    state: MotionValueState,
    key: string,
    value: MotionValue
) {
    frame.render(() => element.setAttribute("pathLength", "1"))

    if (key === "pathOffset") {
        return state.set(key, value, () =>
            element.setAttribute("strokeDashoffset", toPx(-state.latest[key]))
        )
    } else {
        if (!state.get("strokeDasharray")) {
            state.set("strokeDasharray", new MotionValue("1 1"), () => {
                const { pathLength = 1, pathSpacing = 1 } = state.latest
                element.setAttribute(
                    "strokeDasharray",
                    `${toPx(pathLength)} ${toPx(pathSpacing)}`
                )
            })
        }

        return state.set(key, value, undefined, state.get("strokeDasharray"))
    }
}

const addSVGValue = (
    element: SVGElement,
    state: MotionValueState,
    key: string,
    value: MotionValue
) => {
    if (key.startsWith("path")) {
        return addSVGPathValue(element, state, key, value)
    }

    const handler = key in element.style ? addStyleValue : addAttrValue
    return handler(element, state, key, value)
}

export const svgEffect = /*@__PURE__*/ createSelectorEffect(
    /*@__PURE__*/ createEffect(addSVGValue)
)

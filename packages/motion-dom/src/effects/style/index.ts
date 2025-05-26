import { isCSSVar } from "../../render/dom/is-css-var"
import { transformProps } from "../../render/utils/keys-transform"
import { MotionValue } from "../../value"
import { MotionValueState } from "../MotionValueState"
import { createSelectorEffect } from "../utils/create-dom-effect"
import { createEffect } from "../utils/create-effect"
import { buildTransform } from "./transform"

export const addStyleValue = (
    element: HTMLElement,
    state: MotionValueState,
    key: string,
    value: MotionValue
) => {
    let render: VoidFunction | undefined = undefined
    let computed: MotionValue | undefined = undefined

    if (transformProps.has(key)) {
        if (!state.get("transform")) {
            state.set("transform", new MotionValue("none"), () => {
                element.style.transform = buildTransform(state)
            })
        }

        computed = state.get("transform")
    } else if (isCSSVar(key)) {
        render = () => {
            element.style.setProperty(key, state.latest[key] as string)
        }
    } else {
        render = () => {
            element.style[key as any] = state.latest[key] as string
        }
    }

    return state.set(key, value, render, computed)
}

export const styleEffect = createSelectorEffect(createEffect(addStyleValue))

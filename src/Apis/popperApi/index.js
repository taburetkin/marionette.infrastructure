import { createPopper } from "../../vendors/popper.js";

export const popperApi = {
    create() {
        console.log(typeof createPopper)
    }
}
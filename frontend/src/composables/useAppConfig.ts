import { reactive } from 'vue'

const appConfig = reactive({
    ui: {
        colors: {
            primary: 'green',
            neutral: 'slate'
        }
    }
})

export const useAppConfig = () => appConfig

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cafe',
      neutral: 'neutral'
    },
    input: {
      defaultVariants: {
        size: 'md'
      }
    },
    formField: {
      defaultVariants: {
        size: 'sm'
      },
      slots: {
        label: 'text-[0.65rem] uppercase tracking-widest text-neutral-500 mb-1'
      }
    }
  }
})

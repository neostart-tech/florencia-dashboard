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
    },
    navigationMenu: {
      slots: {
        link: 'text-[0.95rem] py-2 transition-colors duration-200',
        linkLeadingIcon: 'w-5 h-5'
      },
      variants: {
        active: {
          true: {
            link: 'text-cafe-800 font-bold bg-cafe-100/50',
            linkLeadingIcon: 'text-cafe-700'
          }
        }
      }
    }
  }
})

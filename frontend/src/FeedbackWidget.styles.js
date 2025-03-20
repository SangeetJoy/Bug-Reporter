export const styles = {
  feedbackButton: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    bgcolor: 'primary.main',
    color: 'white',
    borderRadius: 3,
    px: 2.5,
    py: 1.25,
    minHeight: 0,
    gap: 1,
    '&:hover': {
      bgcolor: 'primary.dark',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    },
    fontSize: '0.9rem',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.15s ease-in-out',
    zIndex: 1050,
    userSelect: 'none'
  },
  buttonIcon: {
    fontSize: 20,
    mb: '-2px',
    transition: 'transform 0.15s ease-in-out',
    '.MuiButton-root:hover &': {
      transform: 'scale(1.1) rotate(-8deg)'
    },
    '.MuiButton-root:active &': {
      transform: 'scale(0.95)'
    }
  },
};

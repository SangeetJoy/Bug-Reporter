  
  export const styles = {
    dialog: {
      position: 'fixed',
      bottom: { xs: '70px', sm: '80px' },
      right: '20px',
      m: 0,
      width: { xs: 'calc(100% - 40px)', sm: '400px' },
      maxHeight: 'calc(100vh - 100px)',
      overflow: 'auto',
      borderRadius: '25px',
      padding: "5px",
      background: "white"
    },
    dialogTitle: {
      textAlign: "center",
      pb: 2.5,
      pt: 2.5,
      fontSize: '1.4rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.5,
      overflow: 'hidden',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        bottom: 12,
        width: '120px',
        height: '2px',
        background: (theme) => `linear-gradient(90deg, transparent, ${theme.palette.primary.main})`
      },
      '&::before': {
        right: '52%',
        marginRight: '30px',
        transform: 'translateX(50%) rotate(180deg)',
        opacity: 0.1
      },
      '&::after': {
        left: '52%',
        marginLeft: '30px',
        transform: 'translateX(-50%)',
        opacity: 0.1
      },
      '& > span': {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -10,
          left: -15,
          right: -15,
          bottom: -10,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
          transform: 'rotate(-3deg)',
          opacity: 0.1,
          borderRadius: '4px'
        }
      }
    },
    titleBox: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1.5,
      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 10%, ${theme.palette.primary.main} 45%, ${theme.palette.primary.dark} 90%)`,
      animation: 'gradient 8s ease-in-out infinite, float 3s ease-in-out infinite',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'inherit',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'blur(8px)',
        opacity: 0.3,
        zIndex: -1
      }
    },
    titleIcon: {
      fontSize: 28,
      mb: '-2px',
      opacity: 0.9,
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))',
      animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    dialogContent: {
      px: 3, 
      pb: 2.5, 
      pt: 1.5,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 24,
        right: 24,
        height: '1px',
        background: (theme) => `linear-gradient(90deg, ${theme.palette.divider}, ${theme.palette.primary.main}22, ${theme.palette.divider})`,
        opacity: 0.15
      },
      '& .MuiTextField-root': {
        '& .MuiOutlinedInput-root': {
          borderRadius: 1.5,
          backgroundColor: (theme) => theme.palette.grey[50],
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.grey[100]
          },
          '&.Mui-focused': {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    textField: {
      mb: 2.5,
      '& .MuiInputLabel-root': { 
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: '0.2px',
        '&.Mui-focused': {
          color: 'primary.main',
          fontWeight: 600
        }
      },
      '& .MuiInputBase-root': { 
        fontSize: '0.875rem',
        transition: 'all 0.2s ease-in-out',
        '&::placeholder': {
          opacity: 0.7
        },
        '&:hover': {
          '& > fieldset': {
            borderColor: 'primary.main',
            borderWidth: '1px',
            opacity: 0.5
          }
        },
        '&.Mui-focused': {
          '& > fieldset': {
            borderWidth: '1.5px',
            boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}0a`
          }
        }
      }
    },
    urlBox: {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -8,
        left: -12,
        right: -12,
        bottom: -8,
        background: (theme) => theme.palette.background.paper,
        borderRadius: 1,
        boxShadow: '0 0 40px rgba(0,0,0,0.03)',
        zIndex: -1
      },
      mb: 3,
      p: 1.5,
      bgcolor: 'grey.50',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'grey.200',
      '&:hover': { bgcolor: 'grey.100', borderColor: 'grey.300' },
      transition: 'all 0.2s ease-in-out',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    urlTitle: {
      mb: 0,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      fontSize: '0.85rem',
      color: 'primary.main',
      letterSpacing: '0.3px'
    },
    urlDot: {
      width: 5,
      height: 5,
      bgcolor: 'primary.main',
      borderRadius: '50%',
      flexShrink: 0,
      opacity: 0.8,
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.15)'
    },
    urlText: {
      fontSize: '0.8rem',
      wordBreak: 'break-all',
      pl: 1.5,
      lineHeight: 1.6,
      opacity: 0.85,
      fontFamily: 'monospace',
      bgcolor: (theme) => theme.palette.grey[50],
      p: 1.5,
      borderRadius: 1,
      border: '1px solid',
      borderColor: (theme) => theme.palette.grey[100],
      transition: 'all 0.2s ease-in-out',
      userSelect: 'all',
      cursor: 'pointer',
      '&:hover': {
        bgcolor: (theme) => theme.palette.grey[100],
        borderColor: (theme) => theme.palette.grey[200]
      }
    },
    dialogActions: {
      px: 3, 
      pb: 2.5, 
      pt: 1,
      position: 'relative',
      gap: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 24,
        right: 24,
        height: '1px',
        background: (theme) => theme.palette.divider,
        opacity: 0.1
      }
    },
    cancelButton: {
      fontSize: '0.875rem', 
      textTransform: 'none',
      color: 'text.secondary',
      px: 2,
      '&:hover': {
        bgcolor: 'grey.50'
      }
    },
    submitButton: {
      fontSize: '0.875rem', 
      textTransform: 'none',
      px: 3,
      py: 0.75,
      bgcolor: 'primary.main',
      fontWeight: 600,
      letterSpacing: '0.3px',
      minWidth: 100,
      '&:hover': {
        bgcolor: 'primary.dark',
        transform: 'translateY(-1px)',
        boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}33`
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: (theme) => `0 2px 8px ${theme.palette.primary.main}22`
      },
      '&.Mui-disabled': {
        bgcolor: (theme) => theme.palette.grey[300],
        color: (theme) => theme.palette.grey[500]
      },
      transition: 'all 0.2s ease-in-out'
    },
  };
  
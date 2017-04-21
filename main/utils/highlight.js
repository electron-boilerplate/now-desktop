const states = {
  hide: false,
  show: true,
  minimize: false,
  restore: true,
  focus: true
}

const windowLeft = win => {
  const windows = global.windows

  if (!windows) {
    return false
  }

  if (
    windows.tutorial && windows.about === win && windows.tutorial.isVisible()
  ) {
    return true
  }

  if (windows.about && windows.tutorial === win && windows.about.isVisible()) {
    return true
  }

  return false
}

module.exports = (win, tray) => {
  if (!tray) {
    return
  }

  for (const state in states) {
    if (!{}.hasOwnProperty.call(states, state)) {
      return
    }

    const highlighted = states[state]

    win.on(state, () => {
      if (process.env.FORCE_CLOSE) {
        return
      }

      // Don't toggle highlighting if one window is still open
      if (windowLeft(win)) {
        return
      }

      // Record busyness for auto updater
      process.env.BUSYNESS = highlighted ? 'window-open' : 'ready'

      // Highlight the tray or don't
      tray.setHighlightMode(highlighted ? 'always' : 'never')
    })
  }

  win.on('close', event => {
    if (process.env.FORCE_CLOSE) {
      return
    }

    win.hide()
    event.preventDefault()
  })
}

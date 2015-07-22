const dynamicBindFirst = (fn, typecheck) =>
  function(...args) {
    const err = typecheck(this)
    if(err) throw err

    return fn(this, ...args)
  }

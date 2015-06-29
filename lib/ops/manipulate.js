var Move = require('./move')
  , isYoungerSiblingOf = require('./is-youngerSibling')
  , isYoungerOrEqualSiblingOf = isYoungerSiblingOf.isYoungerOrEqualSiblingOf
  , isPrefixOf = require('./is-prefix')
  , nodeAt = require('./node-at')

// Paths are arrays, where [] is the root node
function Manipulate(path, prop, value) {
  this.path = path
  this.prop = prop
  this.value = value
  this.type = 'Manipulate'
}

module.exports = Manipulate

Manipulate.prototype.transformAgainst = function (op, left) {
  if(op instanceof Move && this.path) {
    var path = this.path.slice(0)
      , level

    if (op.from) {
      if (isPrefixOf(op.from, this.path)) {
        if(op.to)
          path = Array.prototype.concat(op.to, this.path.slice(op.from.length)) // go with the flow man.
        else
          path = null
      }

      if ((level = isYoungerSiblingOf(this.path, op.from)) !== false)
        path[level]-- // (shift to left)
    }

    if (op.to) {
      if ((level = isYoungerOrEqualSiblingOf(this.path, op.to)) !== false)
        if(this.path[level] === op.to[level]) {
          if(!left) path[level]++ // (shift to right)
        }else{
          path[level]++
        }
    }

    this.path = path
  }
}


Manipulate.prototype.apply = function (rootNode, index) {
  if(!this.path) return
  var myNode = nodeAt(this.path, rootNode)

  if(!myNode) throw new Error('Doesn\'t fit! Trying to manipulate a non-existing node.')

  myNode.setAttribute(this.prop, this.value)
}

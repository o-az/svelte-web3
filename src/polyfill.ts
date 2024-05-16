// @ts-expect-error l
BigInt.prototype.toJSON = function () {
  return this.toString()
}

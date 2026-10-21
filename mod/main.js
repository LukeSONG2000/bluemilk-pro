'use strict';
module.exports = sdk => {
  sdk.battle.information.install();
  return sdk.lifecycle.compose({
    command(name, payload) {
      if (name === 'snapshot') return sdk.battle.snapshot(payload);
      throw Error('Unknown BlueMilk Pro command');
    }
  });
};

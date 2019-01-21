let DialogModalPlugin = function(scene) {
  // the scene that owns the plugin
  this.scene = scene;
  this.systems = scene.sys;

  if (!scene.sys.settings.isBooted) {
    scene.sys.events.once("boot", this.boot, this);
  }
};

// Register this plugin with the PluginManager
DialogModalPlugin.register = function(PluginManager) {
  PluginManager.register("DialogModalPlugin", DialogModalPlugin, "dialogModal");
};

DialogModalPlugin.prototype = {
  // called when the plugin is loaded by the PluginManager
  boot: function() {
    let eventEmitter = this.systems.events;
    eventEmitter.on("shutdown", this.shutdown, this);
    eventEmitter.on("destroy", this.destroy, this);
  },

  //  Called when a Scene shuts down, it may then come back again later
  // (which will invoke the 'start' event) but should be considered dormant.
  shutdown: function() {},

  // called when a Scene is destroyed by the Scene Manager
  destroy: function() {
    this.shutdown();
    this.scene = undefined;
  }
};


/*:
 * @target MZ
 * @plugindesc Play footstep sounds when you walk.
 *@author David Roman-nice
 *@url https://github.com/David-cantCode
 *
 * @help Instructions:
 * put the sound effects in the /audio/se 
 * add terrian tags to the tiles that you want to have sound
 * 1 = grass
 * 2 = dirt
 * 3 = stone
 * 4 = sand
 * 5 = wood
 *
 * 
 * Note: 
 * sounds can easily be added by adding one to the 'groundTypes' array
 * 
 * 
 *
 *
 
 */

(function() {
    var originalGamePlayer_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        originalGamePlayer_initMembers.call(this);
        this._footstepTimer = 0;
        this._footstepLeft = true; //false == right, true == left
        this._currentGroundType = 'default'; 
        this._terrainTag = null; 
    };

    var originalGamePlayer_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        originalGamePlayer_update.call(this, sceneActive);
        if (this._footstepTimer > 0) {
            this._footstepTimer--;
        }
        if (this._footstepTimer === 0 && this.isMoving()) {
            var groundTypes = ["grass", "dirt", "stone", "sand", "wood"]; 

         
            if (!groundTypes.includes(this._currentGroundType)) {
                return; 
            }

            var footstepName = this._footstepLeft ? "Footstep_Left" : "Footstep_Right";
            var footstepVolume = 60;
            var footstepPitch = 130;
            var footstepPan = 0;

            if (this.isDashing()) {
                this._footstepTimer = 5;
            } else {
                this._footstepTimer = 15;
            }

            if (this._currentGroundType !== "default") {
                footstepName += "_" + this._currentGroundType;
            }

            AudioManager.playSe({ name: footstepName, volume: footstepVolume, pitch: footstepPitch, pan: footstepPan });
            this._footstepLeft = !this._footstepLeft;
        }
        this.updateGroundType();
    };

    Game_Player.prototype.updateGroundType = function() {
        var x = $gameMap.roundX($gamePlayer.x);
        var y = $gameMap.roundY($gamePlayer.y);
        var terrainTag = $gameMap.terrainTag(x, y);
        if (terrainTag !== this._terrainTag) {
            this._terrainTag = terrainTag;
            this._currentGroundType = this.getGroundType(terrainTag);
        }
    };

    Game_Player.prototype.getGroundType = function(terrainTag) {
        var groundTypes = {
            1: "grass",
            2: "dirt",
            3: "stone",
            4: "sand",
            5: "wood"
        };
        return groundTypes[terrainTag] || "unknown"; // set unknown terrain to prevent errors
    };




})();

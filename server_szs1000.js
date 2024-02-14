importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);
importPackage(Packages.jp.ngt.rtm)
importPackage(Packages.jp.ngt.rtm.entity.train.util);

function onUpdate(entity, scriptExecuter) {
    var accel = 0.001735;
    notch = entity.getNotch();
    spd = entity.getSpeed();
    door = entity.getVehicleState(TrainState.TrainStateType.Door);

    if (door > 0 && notch > 0) {                  //ドアが開いている || ノッチが0以上
        spd = spd - accel;
        if (spd < accel){
            spd = 0;
        }
        //加速しない(力行回路遮断)
    }else if(notch == 1){
        spd = spd - 0.001041;
    }

    entity.getFormation().setSpeed(spd);

    // speed 1.0 = 72km/h = 20m/s
    //"serverScriptPath": "scripts/server_szs1000.js",
}

/*function onUpdate(entity, scriptExecuter) {
    var accel = 0.001736;
    notch = entity.getNotch();
    spd = entity.getSpeed();
    door = entity.getVehicleState(TrainState.TrainStateType.Door);
    door_r = entity.doorMoveR;
    door_l = entity.doorMoveL;

    if (notch == 1) {
        spd ^= accel * 0.2;
    } else if (notch == 2) {
        spd ^= accel * 0.4;
    } else if (notch == 3) {
        spd ^= accel * 0.6;
    } else if (notch == 4) {
        spd ^= accel * 0.8;
    } else if (notch == 5) {
        spd ^= accel;
    }

    entity.getFormation().setSpeed(spd);
    // speed 1.0 = 72km/h = 20m/s
}*/
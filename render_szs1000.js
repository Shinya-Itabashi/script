
var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);
importPackage(Packages.jp.ngt.rtm)
importPackage(Packages.jp.ngt.rtm.entity.train.util);

function init(par1, par2) {
    main = renderer.registerParts(new Parts(
        "core_20", "underfloor", "cooler", "coupler", "e_coupler", "wipwer_r", 
        "wiper_l", "hood_b", "interior", "acc_20", "cabdoor", "window", "hood_f", 
        "flame_f", "flame_b", "frontdoor", "cab", "handle_l", "handle_r", 
        "panta51_a2", "panta51_a2_1", "panta51_a2_2", "panta51_a2_3", "panta51_a2_4", 
        "panta51_a2_5", "door", "obj30", "incabdoor", "glass", "sidemarker", "monitor"
    ));
    d_lf = renderer.registerParts(new Parts("door_lf"));
    d_lb = renderer.registerParts(new Parts("door_lb"));
    d_rf = renderer.registerParts(new Parts("door_rf"));
    d_rb = renderer.registerParts(new Parts("door_rb"));
    b_l = renderer.registerParts(new Parts("button_l"));
    b_r = renderer.registerParts(new Parts("button_r"));
    light = renderer.registerParts(new Parts("light"));
    marker_r = renderer.registerParts(new Parts("marker_r"));
    marker_l = renderer.registerParts(new Parts("marker_l"));
    
    mon_run = renderer.registerParts(new Parts("mon_run"));
    mon_stop = renderer.registerParts(new Parts("mon_stop"));
    mon_l_opn = renderer.registerParts(new Parts("mon_l_opn"));
    mon_l_opna = renderer.registerParts(new Parts("mon_l_opna"));
    mon_l_cls = renderer.registerParts(new Parts("mon_l_cls"));
    mon_r_opn = renderer.registerParts(new Parts("mon_r_opn"));
    mon_r_opna = renderer.registerParts(new Parts("mon_r_opna"));
    mon_r_cls = renderer.registerParts(new Parts("mon_r_cls"));

    b_bl = renderer.registerParts(new ActionParts(ActionType.TOGGLE, "button_boxl"));
    b_br = renderer.registerParts(new ActionParts(ActionType.TOGGLE, "button_boxr"));
}

function render(entity, pass, par3) {//描画
    if (pass == RenderPass.NORMAL.id) {
        render_main(entity);
        render_door(entity);
        render_bottun(entity);
        render_light(entity);
        render_monitor(entity);
    } /*else if (pass == RenderPass.TRANSPARENT.id) {
    } */else if (pass >= RenderPass.LIGHT.id && pass <= RenderPass.LIGHT_BACK.id) {
        render_light(entity);
        render_marker(entity);
    } else if (pass == RenderPass.PICK.id) {
        render_bottun(entity);
    }
}

function onRightClick(entity, parts) {
    var doorState = entity.getVehicleState(TrainState.TrainStateType.Door);
    if (parts.equals(b_br)) {
        doorState ^= 1;
    } else if (parts.equals(b_bl)) {
        doorState ^= 2;
    }
    entity.syncVehicleState(TrainState.TrainStateType.Door, doorState);
}

/////////////////////////////////////////////
////////////   以下ユーザー関数   ////////////
/////////////////////////////////////////////

function render_main(entity) {
    GL11.glPushMatrix();

    main.render(renderer);

    GL11.glPopMatrix();
}

function render_door(entity) {
    var doorMoveL = 0.0,
        doorMoveR = 0.0;
    spd = 0.0;

    if (entity != null) {
        doorMoveL = renderer.sigmoid(entity.doorMoveL / 60) * 0.65; 
        doorMoveR = renderer.sigmoid(entity.doorMoveR / 60) * 0.65; 
        spd = entity.getSpeed();                                    
        if (spd > 0.06944) {                                        
            entity.syncVehicleState(TrainState.TrainStateType.Door, 0); 
        }
    }

    GL11.glPushMatrix();
    GL11.glTranslatef(0.0, 0.0, doorMoveL);
    d_lf.render(renderer);
    GL11.glPopMatrix();

    GL11.glPushMatrix();
    GL11.glTranslatef(0.0, 0.0, -doorMoveL);
    d_lb.render(renderer);
    GL11.glPopMatrix();

    GL11.glPushMatrix();
    GL11.glTranslatef(0.0, 0.0, doorMoveR);
    d_rf.render(renderer);
    GL11.glPopMatrix();

    GL11.glPushMatrix();
    GL11.glTranslatef(0.0, 0.0, -doorMoveR);
    d_rb.render(renderer);
    GL11.glPopMatrix();
}

function render_bottun(entity) {  
    var door_sta = 0.0;
    btn_r = 0.0;
    btn_l = 0.0;

    if (entity != null) {
        door_sta = entity.getVehicleState(TrainState.TrainStateType.Door); 
    }

    if (door_sta == 1) {
        btn_r = 0.02;
    } else if (door_sta == 2) {
        btn_l = 0.02;
    } else if (door_sta == 3) {
        btn_r = 0.02;
        btn_l = 0.02;
    }

    b_bl.render(renderer);
    b_br.render(renderer);

    GL11.glPushMatrix();
    GL11.glTranslatef(0.0, btn_r, 0.0);
    b_r.render(renderer);
    GL11.glPopMatrix();

    GL11.glPushMatrix();
    GL11.glTranslatef(0.0, btn_l, 0.0);
    b_l.render(renderer);
    GL11.glPopMatrix();
}

function render_light(entity){
    light.render(renderer);
}

function render_marker(entity){
    var doorMoveL = 0,
    doorMoveR = 0;

    if (entity != null) {
        doorMoveL = entity.doorMoveL;             
        doorMoveR = entity.doorMoveR;           
    }

    if (doorMoveL > 0){
        marker_l.render(renderer);
    }
    
    if (doorMoveR > 0){
        marker_r.render(renderer);
    }
}

function render_monitor(entity){
    var spd = 0.0;
        door_r = 0;
        door_l = 0;
        notch = 0;

    if (entity != null){
        spd = entity.getSpeed();
        door_l = entity.doorMoveL;
        door_r = entity.doorMoveR;
        notch = entity.getNotch();
    }

    if (spd > 0.06944) {
        mon_run.render(renderer);
    }else{
        mon_stop.render(renderer);
    }

    if (door_l > 0){
        if (notch > 0){
            mon_l_opna.render(renderer);
        }else{
            mon_l_opn.render(renderer);
        }
    }else{
        mon_l_cls.render(renderer);
    }

    if (door_r > 0){
        if (notch > 0){
            mon_r_opna.render(renderer);
        }else{
            mon_r_opn.render(renderer);
        }
    }else{
        mon_r_cls.render(renderer);
    }
}
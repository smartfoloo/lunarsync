function CPanelTutorial (){
    
    var _oContainer;
    var _oPanel;
    var _oButNext;
    var _oButBack;
    var _oButSkip;
    var _iCurrentPage;
    var _oContainerPage;
    
    this.init = function () {
        var oSprite;
        s_oInterface.setButtonUno(false);
        _oContainerPage = new createjs.Container();
        _iCurrentPage = 0;
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        _oPanel = new createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oPanel.regX = 796/2;
        _oPanel.regY = 517/2;
        _oPanel.alpha = 0.8;
        _oContainer.addChild(_oPanel);
        s_oStage.addChild(_oContainer);
        _oButNext = new CGfxButton(_oContainer.getBounds().width/2-50,0,s_oSpriteLibrary.getSprite("but_arrow"),_oContainer);
        _oButNext.addEventListener(ON_MOUSE_DOWN,this.onButNext,this);
        oSprite = s_oSpriteLibrary.getSprite("but_arrow");
        _oButBack = new CGfxButton(-(_oContainer.getBounds().width/2-50),0,oSprite,_oContainer);
        _oButBack.addEventListener(ON_MOUSE_DOWN,this.onButBack,this);
        _oButBack.getButtonImage().rotation = 180;
        _oButSkip = new CGfxButton(_oContainer.getBounds().width/2-53,_oContainer.getBounds().height/2-53,s_oSpriteLibrary.getSprite("but_skip"),_oContainer);
        _oButSkip.addEventListener(ON_MOUSE_DOWN,this.onButSkip,this);
        this.loadPage(_iCurrentPage);
        
    };
    
    this.loadPage = function (iPage){
        var oText;
        var oExampleCard;
        switch (iPage){
            
            
            case 0: 
                _oButBack.setVisible(false);
                oText = new createjs.Text(TEXT_TUTORIAL1," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -95;
                oText.align = "center";
                oExampleCard =  new CCard(-215,0,_oContainerPage,"card_1_7",0,0);
                _oContainerPage.addChild(oText);
                oExampleCard.setAnimTutorial("tutorial");
                _oContainer.addChild(_oContainerPage);
                break;
                
                
            case 1:
                _oButBack.setVisible(true);
                oText = new createjs.Text(TEXT_TUTORIAL2," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -130;
                oText.align = "center";
                oExampleCard =  new CCard(-215,0,_oContainerPage,"card_0_12",0,0);
                _oContainerPage.addChild(oText);
                oExampleCard.setAnimTutorial("draw2tutorial");
                break;
                
                
            case 2:
                oText = new createjs.Text(TEXT_TUTORIAL3," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -45;
                oText.align = "center";
                oExampleCard =  new CCard(-215,0,_oContainerPage,"card_1_7",0,0);
                _oContainerPage.addChild(oText);
                oExampleCard.setAnimTutorial("stopTurnTutorial");
                break;
                
                
            case 3:
                oText = new createjs.Text(TEXT_TUTORIAL4," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -55;
                oText.align = "center";
                oExampleCard =  new CCard(-215,0,_oContainerPage,"card_1_7",0,0);
                _oContainerPage.addChild(oText);
                oExampleCard.setAnimTutorial("changeClockWiseTutorial");
                break;
            
            
            case 4:
                oText = new createjs.Text(TEXT_TUTORIAL5," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -95;
                oText.align = "center";
                oExampleCard =  new CCard(-215,0,_oContainerPage,"color",0,0);
                _oContainerPage.addChild(oText);
                oExampleCard.instantShow();
                break;
                
                
            case 5:
                _oButNext.setVisible(true);
                oText = new createjs.Text(TEXT_TUTORIAL6," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -170;
                oText.align = "center";
                oExampleCard =  new CCard(-215,0,_oContainerPage,"draw_four",0,0);
                _oContainerPage.addChild(oText);
                oExampleCard.instantShow();
                break;
                
                
            case 6:
                 _oButNext.setVisible(false);
                oText = new createjs.Text(TEXT_TUTORIAL7," 30px "+PRIMARY_FONT,"#FFFFFF");
                oText.lineWidth = 320;
                oText.x = -60;
                oText.y = -100;
                oText.align = "center";
                oExampleCard = new createBitmap(s_oSpriteLibrary.getSprite("but_uno"));
                oExampleCard.regX = 100/2;
                oExampleCard.regY = 101/2;
                oExampleCard.x = -215;
                oExampleCard.scaleX = 1.5;
                oExampleCard.scaleY = 1.5;
                _oContainerPage.addChild(oText);
                _oContainerPage.addChild(oExampleCard);
                break;
        }
    };
    
    this.onButNext = function(){
        _iCurrentPage++;
        _oContainerPage.removeAllChildren();
        this.loadPage(_iCurrentPage);
    };
    
    this.onButBack = function(){
       _iCurrentPage--;
       _oContainerPage.removeAllChildren();
       this.loadPage(_iCurrentPage);
    };
    
    this.onButSkip = function(){
       s_oStage.removeChild(_oContainer);
       s_oInterface.setButtonUno(true);
       s_oGame.startGame();
    };
    
    this.init();
}
"use strict";
var ChatRoomBackground = "";
var ChatRoomData = {};
var ChatRoomCharacter = [];
var ChatRoomLastMessage = [""];
var ChatRoomLastMessageIndex = 0;
var ChatRoomTargetMemberNumber = null;
var ChatRoomOwnershipOption = "";
var ChatRoomLovershipOption = "";
var ChatRoomPlayerCanJoin = false;
var ChatRoomPlayerJoiningAsAdmin = false;
var ChatRoomMoneyForOwner = 0;
var ChatRoomQuestGiven = [];
var ChatRoomSpace = "";
var ChatRoomGame = "";
var ChatRoomSwapTarget = null;
var ChatRoomHelpSeen = false;
var ChatRoomAllowCharacterUpdate = true;
var ChatRoomStruggleAssistBonus = 0;
var ChatRoomStruggleAssistTimer = 0;
var ChatRoomSlowtimer = 0;
var ChatRoomSlowStop = false;

var ChatRoomLeashList = []
var ChatRoomLeashPlayer = null

/**
 * Checks if the player can add the current character to her whitelist. 
 * @returns {boolean} - TRUE if the current character is not in the player's whitelist nor blacklist. 
 */
function ChatRoomCanAddWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
/**
 * Checks if the player can add the current character to her blacklist. 
 * @returns {boolean} - TRUE if the current character is not in the player's whitelist nor blacklist. 
 */
function ChatRoomCanAddBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
/**
 * Checks if the player can remove the current character from her whitelist. 
 * @returns {boolean} - TRUE if the current character is in the player's whitelist, but not her blacklist. 
 */
function ChatRoomCanRemoveWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
/**
 * Checks if the player can remove the current character from her blacklist. 
 * @returns {boolean} - TRUE if the current character is in the player's blacklist, but not her whitelist. 
 */
function ChatRoomCanRemoveBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
/**
 * Checks if the player can add the current character to her friendlist
 * @returns {boolean} - TRUE if the current character is not in the player's friendlist yet.
 */
function ChatRoomCanAddFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
/**
 * Checks if the player can remove the current character from her friendlist.
 * @returns {boolean} - TRUE if the current character is in the player's friendlist.
 */
function ChatRoomCanRemoveFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
/**
 * Checks if the player can add the current character to her ghostlist
 * @returns {boolean} - TRUE if the current character is not in the player's ghostlist yet.
 */
function ChatRoomCanAddGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
/**
 * Checks if the player can remove the current character from her ghostlist.
 * @returns {boolean} - TRUE if the current character is in the player's ghostlist.
 */
function ChatRoomCanRemoveGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
/**
 * Checks if the player can change the current character's clothes
 * @returns {boolean} - TRUE if the player can change the character's clothes and is allowed to.
 */
function ChatRoomCanChangeClothes() { return (Player.CanInteract() && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && CurrentCharacter.AllowItem && !CurrentCharacter.IsEnclose() && !((InventoryGet(CurrentCharacter, "ItemNeck") != null) && (InventoryGet(CurrentCharacter, "ItemNeck").Asset.Name == "ClubSlaveCollar"))) }
/**
 * Checks if the specified owner option is available.
 * @param {string} Option - The option to check for availability
 * @returns {boolean} - TRUE if the current ownership option is the specified one.
 */
function ChatRoomOwnershipOptionIs(Option) { return (Option == ChatRoomOwnershipOption) }
/**
 * Checks if the specified lover option is available.
 * @param {string} Option - The option to check for availability
 * @returns {boolean} - TRUE if the current lover option is the specified one.
 */
function ChatRoomLovershipOptionIs(Option) { return (Option == ChatRoomLovershipOption) }
/**
 * Checks if the player can take a drink from the current character's tray.
 * @returns {boolean} - TRUE if the current character is wearing a drinks tray and the player can interact.
 */
function ChatRoomCanTakeDrink() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (CurrentCharacter.ID != 0) && Player.CanInteract() && (InventoryGet(CurrentCharacter, "ItemMisc") != null) && (InventoryGet(CurrentCharacter, "ItemMisc").Asset.Name == "WoodenMaidTrayFull")) }
/**
 * Checks if the current character is owned by the player.
 * @returns {boolean} - TRUE if the current character is owned by the player.
 */
function ChatRoomIsCollaredByPlayer() { return ((CurrentCharacter != null) && (CurrentCharacter.Ownership != null) && (CurrentCharacter.Ownership.Stage == 1) && (CurrentCharacter.Ownership.MemberNumber == Player.MemberNumber)) }
/**
 * Checks if the current character can serve drinks.
 * @returns {boolean} - TRUE if the character is a maid and is free.
 */
function ChatRoomCanServeDrink() { return ((CurrentCharacter != null) && CurrentCharacter.CanWalk() && (ReputationCharacterGet(CurrentCharacter, "Maid") > 0) && CurrentCharacter.CanTalk()) }
/**
 * Checks if the player can give a money envelope to her owner
 * @returns {boolean} - TRUE if the current character is the owner of the player, and the player has the envelope
 */
function ChatRoomCanGiveMoneyForOwner() { return ((ChatRoomMoneyForOwner > 0) && (CurrentCharacter != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == CurrentCharacter.MemberNumber)) }
/**
 * Checks if the player is a chatroom admin.
 * @returns {boolean} - TRUE if the player is an admin of the current chatroom.
 */
function ChatRoomPlayerIsAdmin() { return ((ChatRoomData != null && ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(Player.MemberNumber) >= 0)) }
/**
 * Checks if the current character is an admin of the chatroom.
 * @returns {boolean} - TRUE if the current character is an admin.
 */
function ChatRoomCurrentCharacterIsAdmin() { return ((CurrentCharacter != null) && (ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
/**
 * Checks if the player is currently swapping between two characters.
 * @returns {boolean} - TRUE if the player is in a swap operation.
 */
function ChatRoomHasSwapTarget() { return (ChatRoomSwapTarget != null) }
/**
 * Checks if the player can help the current character to struggle free.
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanAssistStruggle() { return CurrentCharacter.AllowItem && !CurrentCharacter.CanInteract() }
/**
 * Checks if the character options menu is available.
 * @returns {boolean} - Whether or not the player can interact with the target character
 */
function ChatRoomCanPerformCharacterAction() { return ChatRoomCanAssistStand() ||  ChatRoomCanAssistKneel() || ChatRoomCanAssistStruggle() || ChatRoomCanSendClothesGift() }
/**
 * Checks if the target character can be helped back on her feet. This is different than CurrentCharacter.CanKneel() because it listens for the current active pose and removes certain checks that are not required for someone else to help a person kneel down.
 * @returns {boolean} - Whether or not the target character can stand
 */
function ChatRoomCanAssistStand() { return Player.CanInteract() && CurrentCharacter.AllowItem && CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling() }
/**
 * Checks if the target character can be helped down on her knees. This is different than CurrentCharacter.CanKneel() because it listens for the current active pose and removes certain checks that are not required for someone else to help a person kneel down.
 * @returns {boolean} - Whether or not the target character can stand
 */
function ChatRoomCanAssistKneel() { return Player.CanInteract() && CurrentCharacter.AllowItem && CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() }
/**
 * Checks if the player can stop the current character from leaving.
 * @returns {boolean} - TRUE if the current character is slowed down and can be interacted with.
 */
function ChatRoomCanStopSlowPlayer() { return (CurrentCharacter.IsSlow() && Player.CanInteract() && CurrentCharacter.AllowItem ) }
/**
 * Checks if the player can grab the targeted player's leash
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanHoldLeash() { return CurrentCharacter.AllowItem && Player.CanInteract() && CurrentCharacter.OnlineSharedSettings && CurrentCharacter.OnlineSharedSettings.AllowPlayerLeashing != false && ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) < 0
	&& ChatRoomCanBeLeashed(CurrentCharacter)}
/**
 * Checks if the player can let go of the targeted player's leash
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanStopHoldLeash() { if (CurrentCharacter.AllowItem && Player.CanInteract() && CurrentCharacter.OnlineSharedSettings && CurrentCharacter.OnlineSharedSettings.AllowPlayerLeashing != false && ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) >= 0) {
		if (ChatRoomCanBeLeashed(CurrentCharacter)) {
			return true
		} else {
			ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber), 1)
		}
	}
	return false
}
/**
 * Checks if the targeted player is a valid leash target
 * @returns {boolean} - TRUE if the player can be leashed
 */
function ChatRoomCanBeLeashed(C) {
	// Have to not be tethered, and need a leash
	var canLeash = false
	var isTrapped = false
	var neckLock = null
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily)) {
			if (C.Appearance[A].Asset.Name.indexOf("Leash") >= 0 || (C.Appearance[A].Property && C.Appearance[A].Property.Type && C.Appearance[A].Property.Type.indexOf("Leash") >= 0)) {
				canLeash = true
				if (C.Appearance[A].Asset.Group.Name == "ItemNeckRestraints")
					neckLock = InventoryGetLock(Player.Appearance[A])
			}
		}
	if ((C.Effect.indexOf("Tethered") >= 0) || (C.Effect.indexOf("Mounted") >= 0) || (C.Effect.indexOf("Enclosed") >= 0)) isTrapped = true
	
	if (canLeash && !isTrapped) {
		if (!neckLock || (!neckLock.Asset.OwnerOnly && !neckLock.Asset.LoverOnly) ||
			(neckLock.Asset.OwnerOnly && C.IsOwnedByPlayer()) ||
			(neckLock.Asset.LoverOnly && C.IsLoverOfPlayer()) ||
			C.ID == 0) {
			return true
		}
	}
	return false
}

/**
 * Creates the chat room input elements.
 * @returns {void} - Nothing.
 */
function ChatRoomCreateElement() {

	// Creates the chat box
	if (document.getElementById("InputChat") == null) {
		ElementCreateTextArea("InputChat");
		document.getElementById("InputChat").setAttribute("maxLength", 250);
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
		ElementFocus("InputChat");
	} else if (document.getElementById("InputChat").style.display == "none") ElementFocus("InputChat");

	// Creates the chat log
	if (document.getElementById("TextAreaChatLog") == null) {

		// Sets the size and position
		ElementCreateDiv("TextAreaChatLog");
		ElementPositionFix("TextAreaChatLog", 36, 1005, 5, 988, 859);
		ElementScrollToEnd("TextAreaChatLog");
		ChatRoomRefreshChatSettings(Player);

		// If we relog, we reload the previous chat log
		if (RelogChatLog != null) {
			while (RelogChatLog.children.length > 0)
				document.getElementById("TextAreaChatLog").appendChild(RelogChatLog.children[0]);
			RelogChatLog = null;
		} else ElementContent("TextAreaChatLog", "");

	} else if (document.getElementById("TextAreaChatLog").style.display == "none") {
		setTimeout(() => ElementScrollToEnd("TextAreaChatLog"), 100);
		ChatRoomRefreshChatSettings(Player);
	}

}

/**
 * Loads the chat room screen by displaying the proper inputs.
 * @returns {void} - Nothing.
 */
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ChatRoomCreateElement();
	ChatRoomCharacterUpdate(Player);
	ActivityChatRoomArousalSync(Player);
}

/**
 * Starts the chatroom selection screen.
 * @param {string} Space - Name of the chatroom space
 * @param {string} Game - Name of the chatroom game to play
 * @param {string} LeaveRoom - Name of the room to go too when exiting chatsearch.
 * @param {string} Background - Name of the background to use in chatsearch.
 * @param {Array} BackgroundTagList - List of available backgrounds in the chatroom space.
 * @returns {void} - Nothing.
 */
function ChatRoomStart(Space, Game, LeaveRoom, Background, BackgroundTagList) {
	ChatRoomSpace = Space;
	ChatRoomGame = Game;
	ChatSearchLeaveRoom = LeaveRoom;
	ChatSearchBackground = Background;
	ChatCreateBackgroundList = BackgroundsGenerateList(BackgroundTagList);
	BackgroundSelectionTagList = BackgroundTagList;
	CommonSetScreen("Online", "ChatSearch");
}

/**
 * Checks if the player's owner is inside the chatroom.
 * @returns {boolean} - Returns TRUE if the player's owner is inside the room.
 */
function ChatRoomOwnerInside() {
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber)
			return true;
	return false;
}


/**
 * Draws the chatroom characters.
 * @param {boolean} DoClick - Whether or not a click was registered.
 * @returns {void} - Nothing.
 */
function ChatRoomDrawCharacter(DoClick) {

	// Intercepts the online game chat room clicks if we need to
	if (DoClick && OnlineGameClick()) return;

	// The darkness factors varies with blindness level (1 is bright, 0 is pitch black)
	var DarkFactor = 1.0;
	
	var RenderSingle = false

	// Determine the horizontal & vertical position and zoom levels to fit all characters evenly in the room
	var Space = ChatRoomCharacter.length >= 2 ? 1000 / Math.min(ChatRoomCharacter.length, 5) : 500;
	var Zoom = ChatRoomCharacter.length >= 3 ? Space / 400 : 1;
	var X = ChatRoomCharacter.length >= 3 ? (Space - 500 * Zoom) / 2 : 0;
	var Y = ChatRoomCharacter.length <= 5 ? 1000 * (1 - Zoom) / 2 : 0;
	
	
	if (Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme" && Player.GameplaySettings.BlindDisableExamine) && (Player.GetBlindLevel() >= 3)) {
		RenderSingle = true
		Space = 500
		Zoom = 1
		X = 0
		Y = 0
	}

	// If there's more than 2 characters, we apply a zoom factor, also apply the darkness factor if the player is blindfolded
	if (!DoClick && Player.GetBlindLevel() < 3) {

		// Draws the zoomed background
		DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 500 * (2 - 1 / Zoom), 0, 1000 / Zoom, 1000, 0, Y, 1000, 1000 * Zoom);

		// Draws a black overlay if the character is blind
		if (Player.GetBlindLevel() == 2) DarkFactor = 0.15;
		else if (Player.GetBlindLevel() == 1) DarkFactor = 0.3;
		if (DarkFactor < 1.0) DrawRect(0, 0, 2000, 1000, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");

	}

	// Draw the characters (in click mode, we can open the character menu or start whispering to them)
	for (let C = 0; C < ChatRoomCharacter.length; C++) {
		var CharX = X + (C % 5) * Space;
		var CharY = Y + Math.floor(C / 5) * 500;
		if (RenderSingle) { // Only render the player!
			if (ChatRoomCharacter[C].ID == 0) {
				CharX = 0
				CharY = 0
			} else {
				continue;
			}
			
		}
		if (DoClick) {
			if (MouseIn(CharX, CharY, 450 * Zoom, 1000 * Zoom)) {
				if ((MouseY <= CharY + 900 * Zoom) && (Player.GameplaySettings && Player.GameplaySettings.BlindDisableExamine ? (!(Player.GetBlindLevel() >= 3) || ChatRoomCharacter[C].ID == Player.ID) : true)) {

					// If the arousal meter is shown for that character, we can interact with it
					if ((ChatRoomCharacter[C].ID == 0) || (Player.ArousalSettings.ShowOtherMeter == null) || Player.ArousalSettings.ShowOtherMeter)
						if ((ChatRoomCharacter[C].ID == 0) || ((ChatRoomCharacter[C].ArousalSettings != null) && (ChatRoomCharacter[C].ArousalSettings.Visible != null) && (ChatRoomCharacter[C].ArousalSettings.Visible == "Access") && ChatRoomCharacter[C].AllowItem) || ((ChatRoomCharacter[C].ArousalSettings != null) && (ChatRoomCharacter[C].ArousalSettings.Visible != null) && (ChatRoomCharacter[C].ArousalSettings.Visible == "All")))
							if ((ChatRoomCharacter[C].ArousalSettings != null) && (ChatRoomCharacter[C].ArousalSettings.Active != null) && ((ChatRoomCharacter[C].ArousalSettings.Active == "Manual") || (ChatRoomCharacter[C].ArousalSettings.Active == "Hybrid") || (ChatRoomCharacter[C].ArousalSettings.Active == "Automatic"))) {

								// The arousal meter can be maximized or minimized by clicking on it
								if (MouseIn(CharX + 60 * Zoom, CharY + 400 * Zoom, 80 * Zoom, 100 * Zoom) && !ChatRoomCharacter[C].ArousalZoom) { ChatRoomCharacter[C].ArousalZoom = true; return; }
								if (MouseIn(CharX + 50 * Zoom, CharY + 615 * Zoom, 100 * Zoom, 85 * Zoom) && ChatRoomCharacter[C].ArousalZoom) { ChatRoomCharacter[C].ArousalZoom = false; return; }

								// If the player can manually control her arousal, we set the progress manual and change the facial expression, it can trigger an orgasm at 100%
								if ((ChatRoomCharacter[C].ID == 0) && MouseIn(CharX + 50 * Zoom, CharY + 200 * Zoom, 100 * Zoom, 500 * Zoom) && ChatRoomCharacter[C].ArousalZoom)
									if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Progress != null)) {
										if ((Player.ArousalSettings.Active == "Manual") || (Player.ArousalSettings.Active == "Hybrid")) {
											var Arousal = Math.round((CharY + 625 * Zoom - MouseY) / (4 * Zoom), 0);
											ActivitySetArousal(Player, Arousal);
											if ((Player.ArousalSettings.AffectExpression == null) || Player.ArousalSettings.AffectExpression) ActivityExpression(Player, Player.ArousalSettings.Progress);
											if (Player.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(Player);
										}
										return;
									}

								// Don't do anything if the thermometer is clicked without access to it
								if (MouseIn(CharX + 50 * Zoom, CharY + 200 * Zoom, 100 * Zoom, 415 * Zoom) && ChatRoomCharacter[C].ArousalZoom) return;

							}

					// If a character to swap was selected, we can complete the swap with the second character
					if (ChatRoomHasSwapTarget() && ChatRoomSwapTarget != ChatRoomCharacter[C].MemberNumber) {
						ChatRoomCompleteSwap(ChatRoomCharacter[C].MemberNumber);
						break;
					}

					// Intercepts the online game character clicks if we need to
					if (OnlineGameClickCharacter(ChatRoomCharacter[C])) return;

					// Gives focus to the character
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					ChatRoomBackground = ChatRoomData.Background;
					ChatRoomCharacter[C].AllowItem = (ChatRoomCharacter[C].ID == 0);
					ChatRoomOwnershipOption = "";
					ChatRoomLovershipOption = "";
					if (ChatRoomCharacter[C].ID != 0) ServerSend("ChatRoomAllowItem", { MemberNumber: ChatRoomCharacter[C].MemberNumber });
					CharacterSetCurrent(ChatRoomCharacter[C]);

				} else
					if ((!LogQuery("BlockWhisper", "OwnerRule") || (Player.Ownership == null) || (Player.Ownership.Stage != 1) || (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber) || !ChatRoomOwnerInside())
						&& !(Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (Player.GetBlindLevel() >= 3)))
						ChatRoomTargetMemberNumber = ((ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) || (ChatRoomCharacter[C].ID == 0)) ? null : ChatRoomCharacter[C].MemberNumber;
						
					else if (Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (Player.GetBlindLevel() >= 3))
						ChatRoomTargetMemberNumber = null
				break;
			}
		}
		else {

			// Draw the background a second time for characters 6 to 10 (we do it here to correct clipping errors from the first part)
			if ((C == 5) && (Player.GetBlindLevel() < 3)) {
				DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 500, 1000, 500);
				if (DarkFactor < 1.0) DrawRect(0, 500, 1000, 500, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");
			}

			// Draw the character
			DrawCharacter(ChatRoomCharacter[C], CharX, CharY, Zoom);
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) DrawImage("Icons/Small/Whisper.png", CharX + 75 * Zoom, CharY + 950 * Zoom);

			// Draw the ghostlist/friendlist, whitelist/blacklist, admin icons
			if (ChatRoomCharacter[C].MemberNumber != null) {
				if (Player.WhiteList.includes(ChatRoomCharacter[C].MemberNumber)) DrawImageResize("Icons/Small/WhiteList.png", CharX + 75 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
				else if (Player.BlackList.includes(ChatRoomCharacter[C].MemberNumber)) DrawImageResize("Icons/Small/BlackList.png", CharX + 75 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
				if (Array.isArray(ChatRoomData.Admin) && ChatRoomData.Admin.includes(ChatRoomCharacter[C].MemberNumber))  DrawImageResize("Icons/Small/Admin.png", CharX + 125 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
				if (Player.GhostList.includes(ChatRoomCharacter[C].MemberNumber)) DrawImageResize("Icons/Small/GhostList.png", CharX + 375 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
				else if (Player.FriendList.includes(ChatRoomCharacter[C].MemberNumber)) DrawImageResize("Icons/Small/FriendList.png", CharX + 375 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
			}
		}
	}
}

/**
 * Sends the request to the server to check the current character's relationship status.
 * @returns {void} - Nothing.
 */
function ChatRoomCheckRelationships() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (C.ID != 0) ServerSend("AccountOwnership", { MemberNumber: C.MemberNumber });
	if (C.ID != 0) ServerSend("AccountLovership", { MemberNumber: C.MemberNumber });
}

/**
 * Displays /help content to the player if it's their first visit to a chatroom this session
 * @returns {void} - Nothing.
 */
function ChatRoomFirstTimeHelp() {
	if (!ChatRoomHelpSeen) {
		ChatRoomMessage({ Content: "ChatRoomHelp", Type: "Action", Sender: Player.MemberNumber });
		ChatRoomHelpSeen = true;
	}
}

/**
 * Sets the whisper target.
 * @returns {void} - Nothing.
 */
function ChatRoomTarget() {
	var TargetName = null;
	if (ChatRoomTargetMemberNumber != null) {
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
				TargetName = ChatRoomCharacter[C].Name;
		if (TargetName == null) ChatRoomTargetMemberNumber = null;
	}
	let placeholder = TextGet("PublicChat");
	if (ChatRoomTargetMemberNumber != null) {
		placeholder = TextGet("WhisperTo");
		placeholder += " " + TargetName;
	}
	document.getElementById("InputChat").placeholder = placeholder;
}

/**
 * Runs the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomRun() {

	// Draws the chat room controls
	ChatRoomCreateElement();
	ChatRoomFirstTimeHelp();
	ChatRoomTarget();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	ElementPositionFix("TextAreaChatLog", 36, 1005, 66, 988, 835);
	ElementPosition("InputChat", 1456, 950, 900, 82);
	DrawButton(1905, 908, 90, 90, "", "White", "Icons/Chat.png");
	if (!ChatRoomCanLeave() && ChatRoomSlowtimer != 0){//Player got interrupted while trying to leave. (Via a bind)
		ServerSend("ChatRoomChat", { Content: "SlowLeaveInterrupt", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber}]});
		ServerSend("ChatRoomChat", { Content: "SlowLeaveInterrupt", Type: "Hidden", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber}]});
		ChatRoomSlowtimer = 0;
		ChatRoomSlowStop = false;
	}

	// If the player is slow (ex: ball & chains), she can leave the room with a timer and can be blocked by others
	if (Player.IsSlow() && ChatRoomCanLeave() && (ChatRoomSlowStop == false)) {
		if (ChatRoomSlowtimer == 0) DrawButton(1005, 2, 120, 60, "", "#FFFF00", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
		if ((CurrentTime < ChatRoomSlowtimer) && (ChatRoomSlowtimer != 0)) DrawButton(1005, 2, 120, 60, "", "White", "Icons/Rectangle/Cancel.png", TextGet("MenuCancel"));
		if ((CurrentTime > ChatRoomSlowtimer) && (ChatRoomSlowtimer != 0)) {
			ChatRoomSlowtimer = 0;
			ChatRoomSlowStop = false;
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			ServerSend("ChatRoomLeave", "");
			CommonSetScreen("Online", "ChatSearch");
		}
	}

	// If the player is slow and was stopped from leaving by another player
	if ((ChatRoomSlowStop == true) && Player.IsSlow()) {
		DrawButton(1005, 2, 120, 60, "", "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
		if (CurrentTime > ChatRoomSlowtimer) {
			 ChatRoomSlowtimer = 0;
			 ChatRoomSlowStop = false;
		}
	}

	// Draws the top buttons in pink if they aren't available
	if (!Player.IsSlow() || (ChatRoomSlowtimer == 0 && !ChatRoomCanLeave())){
		if (ChatRoomSlowtimer != 0) ChatRoomSlowtimer = 0;
		DrawButton(1005, 2, 120, 60, "", (ChatRoomCanLeave()) ? "White" : "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
	}	
	
	if (ChatRoomGame == "") DrawButton(1179, 2, 120, 60, "", "White", "Icons/Rectangle/Cut.png", TextGet("MenuCut"));
	else DrawButton(1179, 2, 120, 60, "", "White", "Icons/Rectangle/GameOption.png", TextGet("MenuGameOption"));
	DrawButton(1353, 2, 120, 60, "", (Player.CanKneel()) ? "White" : "Pink", "Icons/Rectangle/Kneel.png", TextGet("MenuKneel"));
	DrawButton(1527, 2, 120, 60, "", (Player.CanChange() && OnlineGameAllowChange()) ? "White" : "Pink", "Icons/Rectangle/Dress.png", TextGet("MenuDress"));
	DrawButton(1701, 2, 120, 60, "", "White", "Icons/Rectangle/Character.png", TextGet("MenuProfile"));
	DrawButton(1875, 2, 120, 60, "", "White", "Icons/Rectangle/Preference.png", TextGet("MenuAdmin"));

	// In orgasm mode, we add a pink filter and different controls depending on the stage.  The pink filter shows a little above 90
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Active != "Inactive") && (Player.ArousalSettings.Active != "NoMeter")) {	
		if ((Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {
			DrawRect(0, 0, 1003, 1000, "#FFB0B0B0");
			DrawRect(1003, 0, 993, 63, "#FFB0B0B0");
			if (Player.ArousalSettings.OrgasmStage == null) Player.ArousalSettings.OrgasmStage = 0;
			if (Player.ArousalSettings.OrgasmStage == 0) {
				DrawText(TextGet("OrgasmComing"), 500, 410, "White", "Black");
				DrawButton(200, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(550, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (Player.ArousalSettings.OrgasmStage == 1) DrawButton(ActivityOrgasmGameButtonX, ActivityOrgasmGameButtonY, 250, 64, ActivityOrgasmResistLabel, "White");
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 500, 500, "White", "Black");
			ActivityOrgasmProgressBar(50, 970);
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 91) && (Player.ArousalSettings.Progress <= 99)) {
			if ((ChatRoomCharacter.length <= 2) || (ChatRoomCharacter.length >= 6) ||
				(Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme" && Player.GameplaySettings.BlindDisableExamine) && (Player.GetBlindLevel() >= 3))) DrawRect(0, 0, 1003, 1000, "#FFB0B040");
			else if (ChatRoomCharacter.length == 3) DrawRect(0, 50, 1003, 900, "#FFB0B040");
			else if (ChatRoomCharacter.length == 4) DrawRect(0, 150, 1003, 700, "#FFB0B040");
			else if (ChatRoomCharacter.length == 5) DrawRect(0, 250, 1003, 500, "#FFB0B040");
		}
	}

	// Runs any needed online game script
	OnlineGameRun();

}

/**
 * Handles clicks the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomClick() {

	// In orgasm mode, we do not allow any clicks expect the chat
	if (MouseIn(1905, 910, 90, 90)) ChatRoomSendChat();
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if (MouseIn(200, 532, 250, 68) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if (MouseIn(550, 532, 250, 68) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX) && (MouseX <= ActivityOrgasmGameButtonX + 250) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// When the user chats or clicks on a character
	if (MouseIn(0, 0, 1000, 1000)) ChatRoomDrawCharacter(true);

	// When the user leaves
	if (MouseIn(1005, 0, 120, 62) && ChatRoomCanLeave() && !Player.IsSlow()) {
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		ServerSend("ChatRoomLeave", "");
		CommonSetScreen("Online", "ChatSearch");
		CharacterDeleteAllOnline();
		
		// Clear leash since the player has escaped
		ChatRoomLeashPlayer = null
	}

	// When the player is slow and attempts to leave
	if (MouseIn(1005, 0, 120, 62) && ChatRoomCanLeave() && Player.IsSlow()) {

		// If the player clicked to leave, we start a timer based on evasion level and send a chat message
		if ((ChatRoomSlowtimer == 0) && (ChatRoomSlowStop == false)) {
			ServerSend("ChatRoomChat", { Content: "SlowLeaveAttempt", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber}]});
			ChatRoomSlowtimer = CurrentTime + (10 * (1000 - (50 * SkillGetLevelReal(Player, "Evasion"))));
		}

		// If the player clicked to cancel leaving, we alert the room and stop the timer
		else if ((ChatRoomSlowtimer != 0) && (ChatRoomSlowStop == false)) {
			ServerSend("ChatRoomChat", { Content: "SlowLeaveCancel", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber}]});
			ChatRoomSlowtimer = 0;
		}

	}

	// When the user wants to remove the top part of his chat to speed up the screen, we only keep the last 20 entries
	if (MouseIn(1179, 2, 120, 62) && (ChatRoomGame == "")) {
		var L = document.getElementById("TextAreaChatLog");
		while (L.childElementCount > 20)
			L.removeChild(L.childNodes[0]);
		ElementScrollToEnd("TextAreaChatLog");
	}

	// The cut button can become the game option button if there's an online game going on
	if (MouseIn(1179, 2, 120, 62) && (ChatRoomGame != "")) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		CommonSetScreen("Online", "Game" + ChatRoomGame);
	}

	// When the user character kneels
	if (MouseIn(1353, 0, 120, 62) && Player.CanKneel()) {
		ServerSend("ChatRoomChat", { Content: (Player.ActivePose == null) ? "KneelDown" : "StandUp", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
		CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
		ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
	}

	// When the user wants to change clothes
	if (MouseIn(1527, 0, 120, 62) && Player.CanChange() && OnlineGameAllowChange()) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		CharacterAppearanceReturnRoom = "ChatRoom";
		CharacterAppearanceReturnModule = "Online";
		CharacterAppearanceLoadCharacter(Player);
	}

	// When the user checks her profile
	if (MouseIn(1701, 0, 120, 62)) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		InformationSheetLoadCharacter(Player);
	}

	// When the user enters the room administration screen
	if (MouseIn(1875, 0, 120, 62)) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		CommonSetScreen("Online", "ChatAdmin");
	}

}

/**
 * Checks if the player can leave the chatroom.
 * @returns {boolean} - Returns TRUE if the player can leave the current chat room.
 */
function ChatRoomCanLeave() {
	if (!Player.CanWalk()) return false; // Cannot leave if cannot walk
	if (!ChatRoomData.Locked || ChatRoomPlayerIsAdmin()) return true; // Can leave if the room isn't locked or is an administrator
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0)
			return false; // Cannot leave if the room is locked and there's an administrator inside
	return true; // Can leave if the room is locked and there's no administrator inside
}

/**
 * Handles keyboard shortcuts in the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomKeyDown() {

	// If the input text is not focused and not on mobile, set the focus to it
	if (document.activeElement.id != "InputChat") ElementFocus("InputChat");

	// The ENTER key sends the chat.  The "preventDefault" is needed for <textarea>, otherwise it adds a new line after clearing the field
	if (KeyPress == 13 && !event.shiftKey) {
		event.preventDefault();
		ChatRoomSendChat();
	}

	// On page up, we show the previous chat typed
	if (KeyPress == 33) {
		if (ChatRoomLastMessageIndex > 0) ChatRoomLastMessageIndex--;
		ElementValue("InputChat", ChatRoomLastMessage[ChatRoomLastMessageIndex]);
	}

	// On page down, we show the next chat typed
	if (KeyPress == 34) {
		ChatRoomLastMessageIndex++;
		if (ChatRoomLastMessageIndex > ChatRoomLastMessage.length - 1) ChatRoomLastMessageIndex = ChatRoomLastMessage.length - 1;
		ElementValue("InputChat", ChatRoomLastMessage[ChatRoomLastMessageIndex]);
	}

}

/**
 * Sends the chat message to the room
 * @returns {void} - Nothing.
 */
function ChatRoomSendChat() {

	// If there's a message to send
	var msg = ElementValue("InputChat").trim()
	if (msg != "") {

		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		ChatRoomLastMessage.push(msg);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;

		var m = msg.toLowerCase().trim();


		// Some custom functions like /dice or /coin are implemented for randomness
		if (m.indexOf("/dice") == 0) {

			// The player can roll X dice of Y faces, using XdY.  If no size is specified, a 6 sided dice is assumed
			if (/(^\d+)[dD](\d+$)/.test(msg.substring(5, 50).trim())) {
				var Roll = /(^\d+)[dD](\d+$)/.exec((msg.substring(5, 50).trim()));
				var DiceNumber = (!Roll) ? 1 : parseInt(Roll[1]);
				var DiceSize = (!Roll) ? 6 : parseInt(Roll[2]);
				if ((DiceNumber < 1) || (DiceNumber > 100)) DiceNumber = 1;
			}
			else if (/(^\d+$)/.test((msg.substring(5, 50).trim()))) {
				var Roll = /(^\d+)/.exec((msg.substring(5, 50).trim()));
				var DiceNumber = 1;
				var DiceSize = (!Roll) ? 6 : parseInt(Roll[1]);
			}
			else DiceNumber = 0;

			// If there's at least one dice to roll
			if (DiceNumber > 0) {
				if ((DiceSize < 2) || (DiceSize > 100)) DiceSize = 6;
				var CurrentRoll = 0;
				var Result = [];
				var Total = 0;
				while (CurrentRoll < DiceNumber) {
					var Roll = Math.floor(Math.random() * DiceSize) + 1
					Result.push(Roll);
					Total += Roll;
					CurrentRoll++;
				}
				msg = "ActionDice";
				var Dictionary = [];
				Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
				Dictionary.push({ Tag: "DiceType", Text: DiceNumber.toString() + "D" + DiceSize.toString() });
				if (DiceNumber > 1) {
					Result.sort((a, b) => a - b);
					Dictionary.push({ Tag: "DiceResult", Text: Result.toString() + " = " + Total.toString() });
				}
				else if (DiceNumber == 1) Dictionary.push({ Tag: "DiceResult", Text: Total.toString() });
				if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
			}

		} else if (m.indexOf("/coin") == 0) {

			// The player can flip a coin, heads or tails are 50/50
			msg = "ActionCoin";
			var Heads = (Math.random() >= 0.5);
			var Dictionary = [];
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
			Dictionary.push({ Tag: "CoinResult", TextToLookUp: Heads ? "Heads" : "Tails" });
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });

		} else if ((m.indexOf("*") == 0) || (m.indexOf("/me ") == 0) || (m.indexOf("/action ") == 0)) {
			

			// The player can emote an action using * or /me (for those IRC or Skype users), it doesn't garble
			// The command /action or ** does not add the player's name to it
			msg = msg.replace("*", "");
			msg = msg.replace(/\/me /g, "");
			msg = msg.replace(/\/action /g, "*");
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });

		}
		else if (m.indexOf("/help") == 0) ServerSend("ChatRoomChat", { Content: "ChatRoomHelp", Type: "Action", Target: Player.MemberNumber});
		else if (m.indexOf("/safeword") == 0) ChatRoomSafewordChatCommand();
		else if (m.indexOf("/friendlistadd ") == 0) ChatRoomListManipulation(Player.FriendList, null, msg);
		else if (m.indexOf("/friendlistremove ") == 0) ChatRoomListManipulation(null, Player.FriendList, msg);
		else if (m.indexOf("/ghostadd ") == 0) { ChatRoomListManipulation(Player.GhostList, null, msg); ChatRoomListManipulation(Player.BlackList, Player.WhiteList, msg); }
		else if (m.indexOf("/ghostremove ") == 0) { ChatRoomListManipulation(null, Player.GhostList, msg); ChatRoomListManipulation(null, Player.BlackList, msg); }
		else if (m.indexOf("/whitelistadd ") == 0) ChatRoomListManipulation(Player.WhiteList, Player.BlackList, msg);
		else if (m.indexOf("/whitelistremove ") == 0) ChatRoomListManipulation(null, Player.WhiteList, msg);
		else if (m.indexOf("/blacklistadd ") == 0) ChatRoomListManipulation(Player.BlackList, Player.WhiteList, msg);
		else if (m.indexOf("/blacklistremove ") == 0) ChatRoomListManipulation(null, Player.BlackList, msg);
		else if (m.indexOf("/ban ") == 0) ChatRoomAdminChatAction("Ban", msg);
		else if (m.indexOf("/unban ") == 0) ChatRoomAdminChatAction("Unban", msg);
		else if (m.indexOf("/kick ") == 0) ChatRoomAdminChatAction("Kick", msg);
		else if (m.indexOf("/promote ") == 0) ChatRoomAdminChatAction("Promote", msg);
		else if (m.indexOf("/demote ") == 0) ChatRoomAdminChatAction("Demote", msg);
		else if (m.indexOf("/afk") == 0) CharacterSetFacialExpression(Player, "Emoticon", "Afk");
		else if (msg != "" && !((ChatRoomTargetMemberNumber != null || m.indexOf("(") == 0) && Player.ImmersionSettings && Player.ImmersionSettings.BlockGaggedOOC && !Player.CanTalk())) {
			if (ChatRoomTargetMemberNumber == null) {
				// Regular chat
				ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
			} else {
				// The whispers get sent to the server and shown on the client directly
				ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
				var TargetName = "";
				for (let C = 0; C < ChatRoomCharacter.length; C++)
					if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
						TargetName = ChatRoomCharacter[C].Name;

				var div = document.createElement("div");
				div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
				div.setAttribute('data-time', ChatRoomCurrentTime());
				div.setAttribute('data-sender', Player.MemberNumber.toString());
				div.innerHTML = TextGet("WhisperTo") + " " + TargetName + ": " + msg;

				var Refocus = document.activeElement.id == "InputChat";
				var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
				if (document.getElementById("TextAreaChatLog") != null) {
					document.getElementById("TextAreaChatLog").appendChild(div);
					if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
					if (Refocus) ElementFocus("InputChat");
				}
			}
		}	else {
				// Throw an error message
				ChatRoomMessage({ Content: "ChatRoomBlockGaggedOOC", Type: "Action", Sender: Player.MemberNumber });
		}
		// Clears the chat text message
		ElementValue("InputChat", "");

	}

}

/**
 * Publishes common player actions (add, remove, swap) to the chat.
 * @param {Character} C - Character on which the action is done.
 * @param {Asset} DialogProgressPrevItem - The item that has been removed.
 * @param {Asset} DialogProgressNextItem - The item that has been added.
 * @param {boolean} LeaveDialog - Whether to leave the current dialog after publishing the action.
 * @param {string} [Action] - Action modifier 
 * @returns {void} - Nothing.
 */
function ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, LeaveDialog, Action = null) {
	if (CurrentScreen == "ChatRoom") {

		// Prepares the message
		var msg = "";
		var Dictionary = [];
		if (Action == null) {
			if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && (DialogProgressPrevItem.Asset.Name == DialogProgressNextItem.Asset.Name) && (DialogProgressPrevItem.Color != DialogProgressNextItem.Color)) msg = "ActionChangeColor";
			else if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && !DialogProgressNextItem.Asset.IsLock) msg = "ActionSwap";
			else if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && DialogProgressNextItem.Asset.IsLock) msg = "ActionAddLock";
			else if (InventoryItemHasEffect(DialogProgressNextItem, "Lock")) msg = "ActionLock";
			else if ((DialogProgressNextItem != null) && (!DialogProgressNextItem.Asset.Wear) && (DialogProgressNextItem.Asset.DynamicActivity(Player) != null)) msg = "ActionActivity" + DialogProgressNextItem.Asset.DynamicActivity(Player);
			else if (DialogProgressNextItem != null) msg = "ActionUse";
			else if (InventoryItemHasEffect(DialogProgressPrevItem, "Lock")) msg = "ActionUnlockAndRemove";
			else msg = "ActionRemove";
		} else if (Action == "interrupted") {
			if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && !DialogProgressNextItem.Asset.IsLock) msg = "ActionInterruptedSwap";
			else if (DialogProgressNextItem != null) msg = "ActionInterruptedAdd";
			else msg = "ActionInterruptedRemove";
			Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		} else msg = Action;

		// Replaces the action tags to build the phrase
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		if (DialogProgressPrevItem != null) Dictionary.push({ Tag: "PrevAsset", AssetName: DialogProgressPrevItem.Asset.Name });
		if (DialogProgressNextItem != null) Dictionary.push({ Tag: "NextAsset", AssetName: DialogProgressNextItem.Asset.Name });
		if (C.FocusGroup != null) Dictionary.push({ Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name });

		// Prepares the item packet to be sent to other players in the chatroom
		ChatRoomCharacterItemUpdate(C);

		// Sends the result to the server and leaves the dialog if we need to
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		if (LeaveDialog && (CurrentCharacter != null)) DialogLeave();

	}
}

/**
 * Updates an item on character for everyone in a chat room - replaces ChatRoomCharacterUpdate to cut on the lag.
 * @param {Character} C - Character to update.
 * @param {string} Group - Item group to update.
 * @returns {void} - Nothing.
 */
function ChatRoomCharacterItemUpdate(C, Group) {
	if ((Group == null) && (C.FocusGroup != null)) Group = C.FocusGroup.Name;
	if ((CurrentScreen == "ChatRoom") && (Group != null)) {
		var Item = InventoryGet(C, Group);
		var P = {};
		P.Target = C.MemberNumber;
		P.Group = Group;
		P.Name = (Item != null) ? Item.Asset.Name : undefined;
		P.Color = ((Item != null) && (Item.Color != null)) ? Item.Color : "Default";
		P.Difficulty = (Item != null) ? (Item.Difficulty - Item.Asset.Difficulty) : SkillGetWithRatio("Bondage");
		P.Property = ((Item != null) && (Item.Property != null)) ? Item.Property : undefined;
		ServerSend("ChatRoomCharacterItemUpdate", P);
	}
}

/**
 * Publishes a custom action to the chat
 * @param {string} msg - Tag of the action to send
 * @param {boolean} LeaveDialog - Whether or not the dialog should be left.
 * @param {Array.<{Tag: string, Text: string, MemberNumber: number}>} Dictionary - Dictionary of tags and data to send to the room.
 * @returns {void} - Nothing.
 */
function ChatRoomPublishCustomAction(msg, LeaveDialog, Dictionary) {
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		var C = CharacterGetCurrent();
		ChatRoomCharacterItemUpdate(C);
		if (LeaveDialog && (C != null)) DialogLeave();
	}
}

/**
 * Pushes the new character data/appearance to the server.
 * @param {Character} C - Character to update.
 * @returns {void} - Nothing.
 */
function ChatRoomCharacterUpdate(C) {
	if (ChatRoomAllowCharacterUpdate) {
		var data = {
			ID: (C.ID == 0) ? Player.OnlineID : C.AccountName.replace("Online-", ""),
			ActivePose: C.ActivePose,
			Appearance: ServerAppearanceBundle(C.Appearance)
		};
		ServerSend("ChatRoomCharacterUpdate", data);
	}
}

/**
 * Escapes a given string.
 * @param {string} str - Text to escape.
 * @returns {string} - Escaped string.
 */
function ChatRoomHTMLEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Handles the reception of a chatroom message. Ghost players' messages are ignored.
 * @param {object} data - Message object containing things like the message type, sender, content, etc. 
 * @returns {void} - Nothing.
 */
function ChatRoomMessage(data) {

	// Make sure the message is valid (needs a Sender and Content)
	if ((data != null) && (typeof data === "object") && (data.Content != null) && (typeof data.Content === "string") && (data.Content != "") && (data.Sender != null) && (typeof data.Sender === "number")) {

		// If we must reset the current game played in the room
		if (data.Content == "ServerUpdateRoom") OnlineGameReset();

		// Exits right away if the sender is ghosted
		if (Player.GhostList.indexOf(data.Sender) >= 0) return;

		// Make sure the sender is in the room
		var SenderCharacter = null;
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomCharacter[C].MemberNumber == data.Sender) {
				SenderCharacter = ChatRoomCharacter[C]
				break;
			}

		// If we found the sender
		if (SenderCharacter != null) {
			// Replace < and > characters to prevent HTML injections
			var msg = ChatRoomHTMLEntities(data.Content);

			// Hidden messages are processed separately, they are used by chat room mini-games / events
			if ((data.Type != null) && (data.Type == "Hidden")) {
				for (let A = 1; A <= 6; A++)
					if (msg == "StruggleAssist" + A.toString()) {
						ChatRoomStruggleAssistTimer = CurrentTime + 60000;
						ChatRoomStruggleAssistBonus = A;
					}
				if (msg == "SlowStop"){
					ChatRoomSlowtimer = CurrentTime + 45000;
					ChatRoomSlowStop = true;
				} 
				if (msg == "HoldLeash"){
					if (SenderCharacter.MemberNumber != ChatRoomLeashPlayer && ChatRoomLeashPlayer != null) {
						ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: ChatRoomLeashPlayer });
					}
					if (ChatRoomCanBeLeashed(Player)) {
						ChatRoomLeashPlayer = SenderCharacter.MemberNumber
					} else {
						ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: SenderCharacter.MemberNumber });
					}
				}
				if (msg == "StopHoldLeash"){
					if (SenderCharacter.MemberNumber == ChatRoomLeashPlayer) {
						ChatRoomLeashPlayer = null
					}
				}
				if (msg == "PingHoldLeash"){ // The dom will ping all players on her leash list and ones that no longer have her as their leasher will remove it
					if (SenderCharacter.MemberNumber != ChatRoomLeashPlayer || !ChatRoomCanBeLeashed(Player)) {
						ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: SenderCharacter.MemberNumber });
					}
				}
 				if (msg == "RemoveLeash" || msg == "RemoveLeashNotFriend"){
					if (ChatRoomLeashList.indexOf(SenderCharacter.MemberNumber) >= 0) {
						ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(SenderCharacter.MemberNumber), 1)
					} 
				} 
				if (msg == "MaidDrinkPick0") MaidQuartersOnlineDrinkPick(data.Sender, 0);
				if (msg == "MaidDrinkPick5") MaidQuartersOnlineDrinkPick(data.Sender, 5);
				if (msg == "MaidDrinkPick10") MaidQuartersOnlineDrinkPick(data.Sender, 10);
				if (msg.substring(0, 8) == "PayQuest") ChatRoomPayQuest(data);
				if (msg.substring(0, 9) == "OwnerRule") data = ChatRoomSetRule(data);
				if (msg == "ClothesGift") ChatRoomReceiveClothesGift();
				if (data.Type == "Hidden") return;
			}

			// Checks if the message is a notification about the user entering or leaving the room
			var MsgEnterLeave = "";
			if ((data.Type == "Action") && (msg.startsWith("ServerEnter")) || (msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick")))
				MsgEnterLeave = " ChatMessageEnterLeave";

			// Replace actions by the content of the dictionary
			if (data.Type && ((data.Type == "Action") || (data.Type == "ServerMessage"))) {
				if (data.Type == "ServerMessage") msg = "ServerMessage" + msg;
				msg = DialogFind(Player, msg);
				if (data.Dictionary) {
					var dictionary = data.Dictionary;
					var SourceCharacter = null;
					var IsPlayerInvolved = (SenderCharacter.MemberNumber == Player.MemberNumber);
					var TargetMemberNumber = null;
					var ActivityName = null;
					var GroupName = null;
					var ActivityCounter = 1;
					var Automatic = false;
					for (let D = 0; D < dictionary.length; D++) {

						// If there's a member number in the dictionary packet, we use that number to alter the chat message
						if (dictionary[D].MemberNumber) {

							// Alters the message displayed in the chat room log, and stores the source & target in case they're required later
							if ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName")) {
								msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "DestinationCharacter")) ? DialogFind(Player, "Her") : (PreferenceIsPlayerInSensDep() && dictionary[D].MemberNumber != Player.MemberNumber ? DialogFind(Player, "Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text) + DialogFind(Player, "'s")));
								TargetMemberNumber = dictionary[D].MemberNumber;
							}
							else if ((dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName")) {
								msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "TargetCharacter")) ? DialogFind(Player, "Herself") : (PreferenceIsPlayerInSensDep() && dictionary[D].MemberNumber != Player.MemberNumber ? DialogFind(Player, "Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text)));
								TargetMemberNumber = dictionary[D].MemberNumber;
							}
							else if (dictionary[D].Tag == "SourceCharacter") {
								msg = msg.replace(dictionary[D].Tag, (PreferenceIsPlayerInSensDep() && (dictionary[D].MemberNumber != Player.MemberNumber)) ? DialogFind(Player, "Someone") : ChatRoomHTMLEntities(dictionary[D].Text));
								for (let T = 0; T < ChatRoomCharacter.length; T++)
									if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber)
										SourceCharacter = ChatRoomCharacter[T];
							}

							// Sets if the player is involved in the action
							if (!IsPlayerInvolved && ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName") || (dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName") || (dictionary[D].Tag == "SourceCharacter" || dictionary[D].Tag === "ItemMemberNumber")))
								if (dictionary[D].MemberNumber == Player.MemberNumber)
									IsPlayerInvolved = true;

						}
						else if (dictionary[D].TextToLookUp) msg = msg.replace(dictionary[D].Tag, DialogFind(Player, ChatRoomHTMLEntities(dictionary[D].TextToLookUp)).toLowerCase());
						else if (dictionary[D].AssetName) {
							for (let A = 0; A < Asset.length; A++)
								if (Asset[A].Name == dictionary[D].AssetName) {
									msg = msg.replace(dictionary[D].Tag, Asset[A].DynamicDescription(SourceCharacter || Player).toLowerCase());
									ActivityName = Asset[A].DynamicActivity(SourceCharacter || Player);
									break;
								}
						}
						else if (dictionary[D].AssetGroupName) {
							for (let A = 0; A < AssetGroup.length; A++)
								if (AssetGroup[A].Name == dictionary[D].AssetGroupName) {
									msg = msg.replace(dictionary[D].Tag, AssetGroup[A].Description.toLowerCase());
									GroupName = dictionary[D].AssetGroupName;
								}
						}
						else if (dictionary[D].ActivityCounter) ActivityCounter = dictionary[D].ActivityCounter;
						else if (dictionary[D].Automatic) Automatic = true;
						else if (msg != null) msg = msg.replace(dictionary[D].Tag, ChatRoomHTMLEntities(dictionary[D].Text));
					}

					// For automatic messages, do not show the message if the player is not involved, depending on their preferences
					if (Automatic && !IsPlayerInvolved && !Player.ChatSettings.ShowAutomaticMessages) {
						return;
					}

					// If another player is using an item which applies an activity on the current player, apply the effect here
					if ((ActivityName != null) && (TargetMemberNumber != null) && (TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber))
						if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
							ActivityEffect(SenderCharacter, Player, ActivityName, GroupName, ActivityCounter);

					// Launches the audio file if allowed
					if (!Player.AudioSettings.PlayItemPlayerOnly || IsPlayerInvolved)
						AudioPlayContent(data);

				}
			}

			// Prepares the HTML tags
			if (data.Type != null) {
				if (data.Type == "Chat" || data.Type == "Whisper") {
					msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray');
					if (data.Type == "Whisper") msg += '; font-style: italic';
					msg += ';">';

					if (PreferenceIsPlayerInSensDep() && SenderCharacter.MemberNumber != Player.MemberNumber && data.Type != "Whisper") {
						msg += SpeechGarble(SenderCharacter, SenderCharacter.Name);
					} else {
						msg += SenderCharacter.Name;
					}
					msg += ':</span> ';

					if (data.Type == "Whisper") {
						msg += ChatRoomHTMLEntities(data.Content);
					} else {
						msg += ChatRoomHTMLEntities(SpeechGarble(SenderCharacter, data.Content));
					}
				}
				else if (data.Type == "Emote") {
					if (msg.indexOf("*") == 0) msg = msg + "*";
					else if ((msg.indexOf("'") == 0) || (msg.indexOf(",") == 0)) msg = "*" + SenderCharacter.Name + msg + "*";
					else if (PreferenceIsPlayerInSensDep() && SenderCharacter.MemberNumber != Player.MemberNumber) msg = "*" + DialogFind(Player, "Someone") + " " + msg + "*";
					else msg = "*" + SenderCharacter.Name + " " + msg + "*";
				}
				else if (data.Type == "Action") msg = "(" + msg + ")";
				else if (data.Type == "ServerMessage") msg = "<b>" + msg + "</b>";
			}

			// Outputs the sexual activities text and runs the activity if the player is targeted
			if ((data.Type != null) && (data.Type === "Activity")) {

				// Creates the output message using the activity dictionary and tags, keep some values to calculate the activity effects on the player
				msg = "(" + ActivityDictionaryText(msg) + ")";
				var TargetMemberNumber = null;
				var ActivityName = null;
				var ActivityGroup = null;
				var ActivityCounter = 1;
				if (data.Dictionary != null)
					for (let D = 0; D < data.Dictionary.length; D++) {
						if (data.Dictionary[D].MemberNumber != null) msg = msg.replace(data.Dictionary[D].Tag, (PreferenceIsPlayerInSensDep() && (data.Dictionary[D].MemberNumber != Player.MemberNumber)) ? DialogFind(Player, "Someone") : ChatRoomHTMLEntities(data.Dictionary[D].Text));
						if ((data.Dictionary[D].MemberNumber != null) && (data.Dictionary[D].Tag == "TargetCharacter")) TargetMemberNumber = data.Dictionary[D].MemberNumber;
						if (data.Dictionary[D].Tag == "ActivityName") ActivityName = data.Dictionary[D].Text;
						if (data.Dictionary[D].Tag == "ActivityGroup") ActivityGroup = data.Dictionary[D].Text;
						if (data.Dictionary[D].ActivityCounter != null) ActivityCounter = data.Dictionary[D].ActivityCounter;
					}

				// If the player does the activity on herself or an NPC, we calculate the result right away
				if ((data.Type === "Action") || ((TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber)))
					if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
						ActivityEffect(SenderCharacter, Player, ActivityName, ActivityGroup, ActivityCounter);

				// Exits before outputting the text if the player doesn't want to see the sexual activity messages
				if ((Player.ChatSettings != null) && (Player.ChatSettings.ShowActivities != null) && !Player.ChatSettings.ShowActivities) return;

			}

			// Adds the message and scrolls down unless the user has scrolled up
			var div = document.createElement("div");
			div.setAttribute('class', 'ChatMessage ChatMessage' + data.Type + MsgEnterLeave);
			div.setAttribute('data-time', ChatRoomCurrentTime());
			div.setAttribute('data-sender', data.Sender);
			if (data.Type == "Emote" || data.Type == "Action" || data.Type == "Activity")
				div.setAttribute('style', 'background-color:' + ChatRoomGetTransparentColor(SenderCharacter.LabelColor) + ';');
			div.innerHTML = msg;

			// Returns the focus on the chat box
			var Refocus = document.activeElement.id == "InputChat";
			var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
			if (document.getElementById("TextAreaChatLog") != null) {
				document.getElementById("TextAreaChatLog").appendChild(div);
				if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
				if (Refocus) ElementFocus("InputChat");
			}

		}
	}
}

/**
 * Handles the reception of the new room data from the server.
 * @param {object} data - Room object containing the updated chatroom data.
 * @returns {void} - Nothing.
 */
function ChatRoomSync(data) {
	if ((data != null) && (typeof data === "object") && (data.Name != null)) {

		// Loads the room
		var Joining = false;
		if ((CurrentScreen != "ChatRoom") && (CurrentScreen != "ChatAdmin") && (CurrentScreen != "Appearance") && (CurrentModule != "Character")) {
			if (ChatRoomPlayerCanJoin) {
				Joining = true;
				ChatRoomPlayerCanJoin = false;
				CommonSetScreen("Online", "ChatRoom");
				if (ChatRoomPlayerJoiningAsAdmin) {
					ChatRoomPlayerJoiningAsAdmin = false;
					// Check if we should push banned members
					if (Player.OnlineSettings && data.Character.length == 1) {
						var BanList = ChatRoomConcatenateBanList(Player.OnlineSettings.AutoBanBlackList, Player.OnlineSettings.AutoBanGhostList);
						if (BanList.length > 0) {
							data.Ban = BanList;
							data.Limit = data.Limit.toString();
							ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: data, Action: "Update" });
						}
					}
				}
			} else return;
		}

		// If someone enters or leaves the chat room only that character must be updated
		if (!Joining && ChatRoomCharacter && ChatRoomData && (ChatRoomData.Name == data.Name)) {
			if (ChatRoomCharacter.length == data.Character.length + 1) {
				ChatRoomCharacter = ChatRoomCharacter.filter(A => data.Character.some(B => A.MemberNumber == B.MemberNumber));
				ChatRoomData = data;
				return;
			}
			else if (ChatRoomCharacter.length == data.Character.length - 1) {
				ChatRoomCharacter.push(CharacterLoadOnline(data.Character[data.Character.length - 1], data.SourceMemberNumber));
				ChatRoomData = data;
				
				if (ChatRoomLeashList.indexOf(data.SourceMemberNumber) >= 0) {
					// Ping to make sure they are still leashed
					ServerSend("ChatRoomChat", { Content: "PingHoldLeash", Type: "Hidden", Target: data.SourceMemberNumber });
				}
				
				return;
			}
		}

		// Load the characters
		ChatRoomCharacter = [];
		for (let C = 0; C < data.Character.length; C++)
			ChatRoomCharacter.push(CharacterLoadOnline(data.Character[C], data.SourceMemberNumber));

		// Keeps a copy of the previous version
		ChatRoomData = data;
		if (ChatRoomData.Game != null) ChatRoomGame = ChatRoomData.Game;

		// Reloads the online game statuses if needed
		OnlineGameLoadStatus();

	}
}

/**
 * Updates a single character in the chatroom
 * @param {object} data - Data object containing the new character data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncSingle(data) {

	// Sets the chat room character data
	if ((data == null) || (typeof data !== "object")) return;
	if ((data.Character == null) || (typeof data.Character !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomCharacter[C] = CharacterLoadOnline(data.Character, data.SourceMemberNumber);

	// Keeps a copy of the previous version
	for (let C = 0; C < ChatRoomData.Character.length; C++)
		if (ChatRoomData.Character[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomData.Character[C] = data.Character;

}

/**
 * Updates a single character's expression in the chatroom.
 * @param {object} data - Data object containing the new character expression data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncExpression(data) {
	if ((data == null) || (typeof data !== "object") || (data.Group == null) || (typeof data.Group !== "string")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Changes the facial expression
			for (let A = 0; A < ChatRoomCharacter[C].Appearance.length; A++)
				if ((ChatRoomCharacter[C].Appearance[A].Asset.Group.Name == data.Group) && (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression))
					if ((data.Name == null) || (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression.indexOf(data.Name) >= 0)) {
						if (!ChatRoomCharacter[C].Appearance[A].Property) ChatRoomCharacter[C].Appearance[A].Property = {};
						if (ChatRoomCharacter[C].Appearance[A].Property.Expression != data.Name) {
							ChatRoomCharacter[C].Appearance[A].Property.Expression = data.Name;
							CharacterRefresh(ChatRoomCharacter[C], false);
						}
					}

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
			return;

		}
}

/**
 * Updates a single character's pose in the chatroom.
 * @param {object} data - Data object containing the new character pose data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncPose(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Sets the active pose
			ChatRoomCharacter[C].ActivePose = data.Pose;
			CharacterRefresh(ChatRoomCharacter[C], false);

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].ActivePose = data.Pose;
			return;

		}
}

/**
 * Updates a single character's arousal progress in the chatroom.
 * @param {object} data - Data object containing the new character arousal data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncArousal(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].MemberNumber == data.MemberNumber) && (ChatRoomCharacter[C].ArousalSettings != null)) {

			// Sets the orgasm count & progress
			ChatRoomCharacter[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
			ChatRoomCharacter[C].ArousalSettings.OrgasmCount = data.OrgasmCount;
			ChatRoomCharacter[C].ArousalSettings.Progress = data.Progress;
			ChatRoomCharacter[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
			if ((ChatRoomCharacter[C].ArousalSettings.AffectExpression == null) || ChatRoomCharacter[C].ArousalSettings.AffectExpression) ActivityExpression(ChatRoomCharacter[C], ChatRoomCharacter[C].ArousalSettings.Progress);

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber) {
					ChatRoomData.Character[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
					ChatRoomData.Character[C].ArousalSettings.OrgasmCount = data.OrgasmCount;
					ChatRoomData.Character[C].ArousalSettings.Progress = data.Progress;
					ChatRoomData.Character[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
				}
			return;

		}
}

/**
 * Determines whether or not an owner/lover exclusive item can be modified by a non-owner/lover
 * @param {object} Data - The item data received from the server which defines the modification being made to the item
 * @param {Asset} Item - The currently equipped item
 * @return {boolean} - Returns true if the defined modification is permitted, false otherwise.
 */
function ChatRoomAllowChangeLockedItem(Data, Item) {
	// Slave collars cannot be modified
	if (Item.Asset.Name == "SlaveCollar") return false;
	// Items with AllowRemoveExclusive can always be removed
	if (Data.Item.Name == null && Item.Asset.AllowRemoveExclusive) return true;
	// Otherwise non-owners/lovers cannot remove/change the item
	if ((Data.Item.Name == null) || (Data.Item.Name == "") || (Data.Item.Name != Item.Asset.Name)) return false;
	// Lock member numbers cannot be modified
	if ((Data.Item.Property == null) || (Data.Item.Property.LockedBy == null) || (Data.Item.Property.LockedBy != Item.Property.LockedBy) || (Data.Item.Property.LockMemberNumber == null) || (Data.Item.Property.LockMemberNumber != Item.Property.LockMemberNumber)) return false;
	return true;
}


/**
 * Updates a single item on a specific character in the chatroom.
 * @param {object} data - Data object containing the data pertaining to the singular item to update.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncItem(data) {
	if ((data == null) || (typeof data !== "object") || (data.Source == null) || (typeof data.Source !== "number") || (data.Item == null) || (typeof data.Item !== "object") || (data.Item.Target == null) || (typeof data.Item.Target !== "number") || (data.Item.Group == null) || (typeof data.Item.Group !== "string")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.Item.Target) {

			// From another user, we prevent changing the item if the current item is locked by owner/lover locks
			if (data.Source != data.Item.Target) {
				var Item = InventoryGet(ChatRoomCharacter[C], data.Item.Group);
				if ((Item != null) && (ChatRoomCharacter[C].Ownership != null) && (ChatRoomCharacter[C].Ownership.MemberNumber != data.Source) && InventoryOwnerOnlyItem(Item))
					if (!ChatRoomAllowChangeLockedItem(data, Item))
						return;
				if ((Item != null) && (ChatRoomCharacter[C].GetLoversNumbers().indexOf(data.Source) < 0) && InventoryLoverOnlyItem(Item) && ((ChatRoomCharacter[C].Ownership == null) || (ChatRoomCharacter[C].Ownership.MemberNumber != data.Source)) && !ChatRoomAllowChangeLockedItem(data, Item))
					return;
			}

			// If there's no name in the item packet, we remove the item instead of wearing it
			ChatRoomAllowCharacterUpdate = false;
			if ((data.Item.Name == null) || (data.Item.Name == "")) {
				InventoryRemove(ChatRoomCharacter[C], data.Item.Group);
			} else {
				var Color = data.Item.Color;
				if (!CommonColorIsValid(Color)) Color = "Default";

				// Wear the item and applies locks and properties if we need to
				InventoryWear(ChatRoomCharacter[C], data.Item.Name, data.Item.Group, Color, data.Item.Difficulty);
				if (data.Item.Property != null) {
					var Item = InventoryGet(ChatRoomCharacter[C], data.Item.Group);
					if (Item != null) {
						Item.Property = data.Item.Property;
						ServerValidateProperties(ChatRoomCharacter[C], Item);
						CharacterRefresh(ChatRoomCharacter[C]);
					}
				}

			}

			// Keeps the change in the chat room data and allows the character to be updated again
			for (let R = 0; R < ChatRoomData.Character.length; R++)
				if (ChatRoomData.Character[R].MemberNumber == data.Item.Target)
					ChatRoomData.Character[R].Appearance = ChatRoomCharacter[C].Appearance;
			ChatRoomAllowCharacterUpdate = true;

		}
}

/**
 * Refreshes the chat log elements for a specified character.
 * @param {Character} C - Character for which the chat is refreshed (Player)
 * @returns {void} - Nothing.
 */
function ChatRoomRefreshChatSettings(C) {
	if (C.ChatSettings) {
		for (let property in C.ChatSettings)
			ElementSetDataAttribute("TextAreaChatLog", property, C.ChatSettings[property]);
		if (C.GameplaySettings && (C.GameplaySettings.SensDepChatLog == "SensDepNames" || C.GameplaySettings.SensDepChatLog == "SensDepTotal" || C.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (C.GetDeafLevel() >= 3) && (Player.GetBlindLevel() >= 3)) ElementSetDataAttribute("TextAreaChatLog", "EnterLeave", "Hidden");
		if (C.GameplaySettings && (C.GameplaySettings.SensDepChatLog == "SensDepTotal" || C.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (C.GetDeafLevel() >= 3) && (Player.GetBlindLevel() >= 3)) {
			ElementSetDataAttribute("TextAreaChatLog", "DisplayTimestamps", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorNames", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActions", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorEmotes", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActivities", "false");
			ElementSetDataAttribute("TextAreaChatLog", "MemberNumbers", "Never");
		}
	}
}

/**
 * Shows the current character's profile (Information Sheet screen)
 * @returns {void} - Nothing.
 */
function ChatRoomViewProfile() {
	if (CurrentCharacter != null) {
		var C = CurrentCharacter;
		DialogLeave();
		InformationSheetLoadCharacter(C);
	}
}

/**
 * Triggered when the player assists another player to struggle out, the bonus is evasion / 2 + 1, with penalties if the player is restrained.
 * @returns {void} - Nothing.
 */
function ChatRoomStruggleAssist() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	var Bonus = SkillGetLevelReal(Player, "Evasion") / 2 + 1;
	if (!Player.CanInteract()) {
		if (InventoryItemHasEffect(InventoryGet(Player, "ItemArms"), "Block", true)) Bonus = Bonus / 1.5;
		if (InventoryItemHasEffect(InventoryGet(Player, "ItemHands"), "Block", true)) Bonus = Bonus / 1.5;
		if (!Player.CanTalk()) Bonus = Bonus / 1.25;
	}
	ServerSend("ChatRoomChat", { Content: "StruggleAssist", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "StruggleAssist" + Math.round(Bonus).toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	DialogLeave();
}

/**
 * Triggered when the player grabs another player's leash
 * @returns {void} - Nothing.
 */
function ChatRoomHoldLeash() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) < 0)
		ChatRoomLeashList.push(CurrentCharacter.MemberNumber)
	DialogLeave();
}

/**
 * Triggered when the player lets go of another player's leash
 * @returns {void} - Nothing.
 */
function ChatRoomStopHoldLeash() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) >= 0)
		ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber), 1)
	DialogLeave();
}

/**
 * Triggered when a dom enters the room
 * @returns {void} - Nothing.
 */
function ChatRoomPingLeashedPlayers() {
	if (ChatRoomLeashList && ChatRoomLeashList.length > 0) {
		for (let P = 0; P < ChatRoomLeashList.length; P++) {
			ServerSend("ChatRoomChat", { Content: "PingHoldLeash", Type: "Hidden", Target: ChatRoomLeashList[P] });
			ServerSend("AccountBeep", { MemberNumber: ChatRoomLeashList[P], BeepType:"Leash"});
		}
	}
}



/**
 * Triggered when a character makes another character kneel/stand.
 * @returns {void} - Nothing
 */
function ChatRoomKneelStandAssist() { 
	ServerSend("ChatRoomChat", { Content: !CurrentCharacter.IsKneeling() ? "HelpKneelDown" : "HelpStandUp", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }, { Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber }] });
	CharacterSetActivePose(CurrentCharacter, !CurrentCharacter.IsKneeling() ? "Kneel" : null, true);
	ChatRoomCharacterUpdate(CurrentCharacter);
}

/**
 * Triggered when a character stops another character from leaving.
 * @returns {void} - Nothing
 */
function ChatRoomStopLeave(){
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber});
	ServerSend("ChatRoomChat", { Content: "SlowStop", Type: "Action", Dictionary: Dictionary});
	ServerSend("ChatRoomChat", { Content: "SlowStop", Type: "Hidden", Target: CurrentCharacter.MemberNumber } );
	DialogLeave();
}

/**
 * Sends an administrative command to the server for the chat room from the character dialog.
 * @param {string} ActionType - Type of action performed.
 * @param {boolean} [Publish] - Whether or not the action should be published.
 * @returns {void} - Nothing
 */
function ChatRoomAdminAction(ActionType, Publish) {
	if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && ChatRoomPlayerIsAdmin()) {
		if ((ActionType == "Swap") || (ActionType == "SwapCancel")) {
			ChatRoomSwapTarget = (ActionType == "Swap") ? CurrentCharacter.MemberNumber : null;
			DialogLeave();
			return;
		}
		ServerSend("ChatRoomAdmin", { MemberNumber: CurrentCharacter.MemberNumber, Action: ActionType, Publish: ((Publish == null) || (Publish != "false")) });
		if ((ActionType == "MoveLeft") || (ActionType == "MoveRight")) {
			var Pos = ChatRoomCharacter.indexOf(CurrentCharacter);
			if (ActionType == "MoveRight") Pos = Pos + 2;
			if (Pos < 1) Pos = 1;
			if (Pos > ChatRoomCharacter.length) Pos = ChatRoomCharacter.length;
			CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("CharacterPosition", Pos.toString());
		} else DialogLeave();
	}
}

/**
 * Swaps the current swap target's position with a given character, then publish the action.
 * @param {number} MemberNumber - Member number of the character to swap with.
 * @returns {void} - Nothing
 */
function ChatRoomCompleteSwap(MemberNumber) {
	if (ChatRoomSwapTarget == null) return;
	ServerSend("ChatRoomAdmin",
		{
			MemberNumber: Player.ID,
			TargetMemberNumber: ChatRoomSwapTarget,
			DestinationMemberNumber: MemberNumber,
			Action: "Swap",
			Publish: true
		});
	ChatRoomSwapTarget = null;
}

/**
 * Sends an administrative command to the server from the chat text field.
 * @param {string} ActionType - Type of action performed.
 * @param {string} Message - Target number of the action.
 * @returns {void} - Nothing
 */
function ChatRoomAdminChatAction(ActionType, Message) {
	if (ChatRoomPlayerIsAdmin()) {
		var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
		if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber))
			ServerSend("ChatRoomAdmin", { MemberNumber: C, Action: ActionType });
	}
}

/**
 * Gets the player's current time as a string.
 * @returns {string} - The player's current local time as a string.
 */
function ChatRoomCurrentTime() {
	var D = new Date();
	return ("0" + D.getHours()).substr(-2) + ":" + ("0" + D.getMinutes()).substr(-2);
}

/**
 * Gets a transparent version of the specified hex color.
 * @param {HexColor} Color - Hex color code.
 * @returns {string} - A transparent version of the specified hex color in the rgba format.
 */
function ChatRoomGetTransparentColor(Color) {
	if (!Color) return "rgba(128,128,128,0.1)";
	var R = Color.substring(1, 3), G = Color.substring(3, 5), B = Color.substring(5, 7);
	return "rgba(" + parseInt(R, 16) + "," + parseInt(G, 16) + "," + parseInt(B, 16) + ",0.1)";
}

/**
 * Adds or removes an online member to/from a specific list. (From the dialog menu)
 * @param {"Add" | "Remove"} Operation - Operation to perform. 
 * @param {string} ListType - Name of the list to alter. (Whitelist, friendlist, blacklist, ghostlist)
 * @returns {void} - Nothing
 */
function ChatRoomListManage(Operation, ListType) {
	if (((Operation == "Add" || Operation == "Remove")) && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player[ListType] != null) && Array.isArray(Player[ListType])) {
		if ((Operation == "Add") && (Player[ListType].indexOf(CurrentCharacter.MemberNumber) < 0)) Player[ListType].push(CurrentCharacter.MemberNumber);
		if ((Operation == "Remove") && (Player[ListType].indexOf(CurrentCharacter.MemberNumber) >= 0)) Player[ListType].splice(Player[ListType].indexOf(CurrentCharacter.MemberNumber), 1);
		ServerPlayerRelationsSync();
		setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
	}
	if (ListType == "GhostList") {
		CharacterRefresh(CurrentCharacter, false);
		ChatRoomListManage(Operation, "BlackList");
	}
}

/**
 * Adds or removes an online member to/from a specific list. (From a typed message.)
 * @param {number[]} [Add] - List to add to.
 * @param {number[]} [Remove] - List to remove from.
 * @param {string} Message - Member number to add/remove.
 * @returns {void} - Nothing
 */
function ChatRoomListManipulation(Add, Remove, Message) {
	var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
	if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber)) {
		if ((Add != null) && (Add.indexOf(C) < 0)) Add.push(C);
		if ((Remove != null) && (Remove.indexOf(C) >= 0)) Remove.splice(Remove.indexOf(C), 1);
		if ((Player.GhostList == Add || Player.GhostList == Remove) && Character.find(Char => Char.MemberNumber == C)) CharacterRefresh(Character.find(Char => Char.MemberNumber == C), false);
		ServerPlayerRelationsSync();
		setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
	}
}

/**
 * Handles reception of data pertaining to if applying an item is allowed.
 * @param {object} data - Data object containing if the player is allowed to interact with a character.
 * @returns {void} - Nothing
 */
function ChatRoomAllowItem(data) {
	if ((data != null) && (typeof data === "object") && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.AllowItem != null) && (typeof data.AllowItem === "boolean"))
		if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber == data.MemberNumber)) {
			CurrentCharacter.AllowItem = data.AllowItem;
			CharacterSetCurrent(CurrentCharacter);
		}
}

/**
 * Triggered when the player wants to change another player's outfit.
 * @returns {void} - Nothing
 */
function ChatRoomChangeClothes() {
	var C = CurrentCharacter;
	DialogLeave();
	CharacterAppearanceLoadCharacter(C);
}

/**
 * Triggered when the player selects an ownership dialog option. (It can change money and reputation)
 * @param {string} RequestType - Type of request being performed.
 * @returns {void} - Nothing
 */
function ChatRoomSendOwnershipRequest(RequestType) {
	if ((ChatRoomOwnershipOption == "CanOfferEndTrial") && (RequestType == "Propose")) { CharacterChangeMoney(Player, -100); DialogChangeReputation("Dominant", 10); }
	if ((ChatRoomOwnershipOption == "CanEndTrial") && (RequestType == "Accept")) DialogChangeReputation("Dominant", -20);
	ChatRoomOwnershipOption = "";
	ServerSend("AccountOwnership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

/**
 * Triggered when the player selects an lovership dialog option. (It can change money and reputation)
 * @param {string} RequestType - Type of request being performed.
 * @returns {void} - Nothing
 */
function ChatRoomSendLovershipRequest(RequestType) {
	if ((ChatRoomLovershipOption == "CanOfferBeginWedding") && (RequestType == "Propose")) CharacterChangeMoney(Player, -100);
	if ((ChatRoomLovershipOption == "CanBeginWedding") && (RequestType == "Accept")) CharacterChangeMoney(Player, -100);
	ChatRoomLovershipOption = "";
	ServerSend("AccountLovership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

/**
 * Triggered when the player picks a drink from a character's maid tray.
 * @param {string} DrinkType - Drink chosen.
 * @param {number} Money - Cost of the drink.
 * @returns {void} - Nothing
 */
function ChatRoomDrinkPick(DrinkType, Money) {
	if (ChatRoomCanTakeDrink()) {
		var Dictionary = [];
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
		Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + DrinkType, Type: "Action", Dictionary: Dictionary });
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + Money.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		CharacterChangeMoney(Player, Money * -1);
		DialogLeave();
	}
}

/**
 * Sends a rule / restriction / punishment to the player's slave client, it will be handled on the slave's side when received.
 * @param {string} RuleType - The rule selected.
 * @param {"Quest" | "Leave"} [Option] - If the rule is a quest or we should just leave the dialog.
 * @returns {void} - Nothing
 */
function ChatRoomSendRule(RuleType, Option) {
	ServerSend("ChatRoomChat", { Content: "OwnerRule" + RuleType, Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (Option == "Quest") {
		if (ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber) >= 0) ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber), 1);
		ChatRoomQuestGiven.push(CurrentCharacter.MemberNumber);
	}
	if ((Option == "Leave") || (Option == "Quest")) DialogLeave();
}

/**
 * Processes a rule sent to the player from her owner.
 * @param {object} data - Received rule data object.
 * @returns {object} - Returns the data object, used to continue processing the chat message.
 */
function ChatRoomSetRule(data) {

	// Only works if the sender is the player, and the player is fully collared
	if ((data != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == data.Sender)) {

		// Wardrobe/changing rules
		if (data.Content == "OwnerRuleChangeAllow") LogDelete("BlockChange", "OwnerRule");
		if (data.Content == "OwnerRuleChangeBlock1Hour") LogAdd("BlockChange", "OwnerRule", CurrentTime + 3600000);
		if (data.Content == "OwnerRuleChangeBlock1Day") LogAdd("BlockChange", "OwnerRule", CurrentTime + 86400000);
		if (data.Content == "OwnerRuleChangeBlock1Week") LogAdd("BlockChange", "OwnerRule", CurrentTime + 604800000);
		if (data.Content == "OwnerRuleChangeBlock") LogAdd("BlockChange", "OwnerRule", CurrentTime + 1000000000000);

		// Whisper rules
		if (data.Content == "OwnerRuleWhisperAllow") LogDelete("BlockWhisper", "OwnerRule");
		if (data.Content == "OwnerRuleWhisperBlock") { LogAdd("BlockWhisper", "OwnerRule"); ChatRoomTargetMemberNumber = null; }

		// Key rules
		if (data.Content == "OwnerRuleKeyAllow") LogDelete("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleKeyConfiscate") InventoryConfiscateKey();
		if (data.Content == "OwnerRuleKeyBlock") LogAdd("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleSelfOwnerLockAllow") LogDelete("BlockOwnerLockSelf", "OwnerRule");
		if (data.Content == "OwnerRuleSelfOwnerLockBlock") LogAdd("BlockOwnerLockSelf", "OwnerRule");

		// Remote rules
		if (data.Content == "OwnerRuleRemoteAllow") LogDelete("BlockRemote", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteAllowSelf") LogDelete("BlockRemoteSelf", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteConfiscate") InventoryConfiscateRemote();
		if (data.Content == "OwnerRuleRemoteBlock") LogAdd("BlockRemote", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteBlockSelf") LogAdd("BlockRemoteSelf", "OwnerRule");

		// Timer cell punishment
		var TimerCell = 0;
		if (data.Content == "OwnerRuleTimerCell5") TimerCell = 5;
		if (data.Content == "OwnerRuleTimerCell15") TimerCell = 15;
		if (data.Content == "OwnerRuleTimerCell30") TimerCell = 30;
		if (data.Content == "OwnerRuleTimerCell60") TimerCell = 60;
		if (TimerCell > 0) {
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedForCell", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CellLock(TimerCell);
		}

		// Collar Rules
		if (data.Content == "OwnerRuleCollarRelease") {
			if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar")) {
				InventoryRemove(Player, "ItemNeck");
				ChatRoomCharacterItemUpdate(Player, "ItemNeck");
				ServerSend("ChatRoomChat", { Content: "PlayerOwnerCollarRelease", Type: "Action", Dictionary: [{Tag: "DestinationCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber}] });
			}
			LogAdd("ReleasedCollar", "OwnerRule");
		}
		if (data.Content == "OwnerRuleCollarWear") {
			if ((InventoryGet(Player, "ItemNeck") == null) || ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name != "SlaveCollar"))) {
				ServerSend("ChatRoomChat", { Content: "PlayerOwnerCollarWear", Type: "Action", Dictionary: [{Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber}] });
			}
			LogDelete("ReleasedCollar", "OwnerRule");
			LoginValidCollar();
		}
		
		// Forced labor
		if (data.Content == "OwnerRuleLaborMaidDrinks" && Player.CanTalk()) {
			CharacterSetActivePose(Player, null);
			var D = TextGet("ActionGrabbedToServeDrinksIntro");
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedToServeDrinks", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CommonSetScreen("Room", "MaidQuarters");
			CharacterSetCurrent(MaidQuartersMaid);
			MaidQuartersMaid.CurrentDialog = D;
			MaidQuartersMaid.Stage = "205";
			MaidQuartersOnlineDrinkFromOwner = true;
		}

		// Switches it to a server message to announce the new rule to the player
		data.Type = "ServerMessage";

	}

	// Returns the data packet
	return data;

}

/**
 * Sends quest money to the player's owner.
 * @returns {void} - Nothing
 */
function ChatRoomGiveMoneyForOwner() {
	if (ChatRoomCanGiveMoneyForOwner()) {
		ServerSend("ChatRoomChat", { Content: "ActionGiveEnvelopeToOwner", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
		ServerSend("ChatRoomChat", { Content: "PayQuest" + ChatRoomMoneyForOwner.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		ChatRoomMoneyForOwner = 0;
		DialogLeave();
	}
}

/**
 * Handles the reception of quest data, when payment is received.
 * @param {object} data - Data object containing the payment.
 * @returns {void} - Nothing
 */
function ChatRoomPayQuest(data) {
	if ((data != null) && (data.Sender != null) && (ChatRoomQuestGiven.indexOf(data.Sender) >= 0)) {
		var M = parseInt(data.Content.substring(8));
		if ((M == null) || isNaN(M)) M = 0;
		if (M < 0) M = 0;
		if (M > 30) M = 30;
		CharacterChangeMoney(Player, M);
		ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(data.Sender), 1);
	}
}

/**
 * Triggered when a game message comes in, we forward it to the current online game being played.
 * @param {object} data - Game data to process, sent to the current game handler.
 * @returns {void} - Nothing
 */
function ChatRoomGameResponse(data) {
	if (ChatRoomGame == "LARP") GameLARPProcess(data);
}

/**
 * Triggered when the player uses the /safeword command, we revert the character if safewords are enabled, and display a warning in chat if not.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordChatCommand() {
	if (DialogChatRoomCanSafeword())
		ChatRoomSafewordRevert();
	else if (CurrentScreen == "ChatRoom") {
		var msg = {Sender: Player.MemberNumber, Content: "SafewordDisabled", Type: "Action"};
		ChatRoomMessage(msg);
	}
}

/**
 * Triggered when the player activates her safeword to revert, we swap her appearance to the state when she entered the chat room lobby, minimum permission becomes whitelist and up.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordRevert() {
	if (ChatSearchSafewordAppearance != null) {
		Player.Appearance = ChatSearchSafewordAppearance.slice(0);
		Player.ActivePose = ChatSearchSafewordPose;
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		ServerSend("ChatRoomChat", { Content: "ActionActivateSafewordRevert", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name }] });
		if (Player.ItemPermission < 3) {
			Player.ItemPermission = 3;
			ServerSend("AccountUpdate", { ItemPermission: Player.ItemPermission });
			setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
		}
	}
}

/**
 * Triggered when the player activates her safeword and wants to be released, we remove all bondage from her and return her to the chat search screen.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordRelease() {
	CharacterReleaseTotal(Player);
	CharacterRefresh(Player);
	ServerSend("ChatRoomChat", { Content: "ActionActivateSafewordRelease", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name}] });
	ElementRemove("InputChat");
	ElementRemove("TextAreaChatLog");
	ServerSend("ChatRoomLeave", "");
	CommonSetScreen("Online","ChatSearch");
}

/** 
 * Concatenates the list of users to ban.
 * @param {boolean} IncludesBlackList - Adds the blacklist to the banlist
 * @param {boolean} IncludesGhostList - Adds the ghostlist to the banlist
 * @param {number[]} [ExistingList] - The existing Banlist, if applicable
 * @returns {number[]} Complete array of members to ban
 */
function ChatRoomConcatenateBanList(IncludesBlackList, IncludesGhostList, ExistingList) {
	var BanList = Array.isArray(ExistingList) ? ExistingList : [];
	if (IncludesBlackList) BanList = BanList.concat(Player.BlackList);
	if (IncludesGhostList) BanList = BanList.concat(Player.GhostList);
	return BanList.filter((MemberNumber, Idx, Arr) => Arr.indexOf(MemberNumber) == Idx);
}

/**
 * Sends gifted clothes to another member.
 * @returns {void} - Nothing
 */
function ChatRoomSendClothesGift() {
	var Value = ChatRoomCalculateClothesGiftValue();
	if (Value > 0) {
		var Dictionary = [
			{ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber },
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }
		];
		ServerSend("ChatRoomChat", { Content: "ActionSentClothesGift", Type: "Action", Dictionary: Dictionary });
		ServerSend("ChatRoomChat", { Content: "ClothesGift", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		CharacterChangeMoney(Player, -Value);
		DialogLeave();
	}
}

/**
 * Handles the reception of gifted clothes by adding worn but not owned clothes to the player's inventory.
 * @returns {void} - Nothing
 */
function ChatRoomReceiveClothesGift() {
	Asset.filter(asset => ChatRoomIsMissingAndWornClothing(Player, asset))
		.forEach(ShopAddBoughtItem);
	ServerPlayerInventorySync();
	ChatRoomCharacterUpdate(Player);
}

/**
 * Checks if the player can send money for worn, missing clothes to the current character.
 * @returns {boolean} - TRUE if the current character has missing clothes and the player has enough money.
 */
function ChatRoomCanSendClothesGift() {
	var Value = ChatRoomCalculateClothesGiftValue();

	if((CurrentCharacter != null) && (CurrentCharacter.CurrentDialog != null))
		CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("REPLACEMONEY", Value.toString());

	return Value > 0;
}

/**
 * Calculates the value of worn, missing clothes for the current character.
 * @return {number} - Total value of clothing items the current character is wearing but doesn't own.
 */
function ChatRoomCalculateClothesGiftValue() {
	if(CurrentCharacter == null) return 0;
	
	return Asset.filter(asset => ChatRoomIsMissingAndWornClothing(CurrentCharacter, asset))
		.map(asset => asset.Value)
		.reduce((valueSum, assetValue) => valueSum + assetValue, 0);
}

/**
 * Checks if an asset is clothing and worn but not owned by the currently selected character
 * @param {Character} character - Character to check if they are wearing and whether they own the item
 * @param {Asset} asset - Asset to check
 * @returns {boolean} - TRUE if the item is a cloting item, worn but not owned by the selected character.
 */
function ChatRoomIsMissingAndWornClothing(character, asset) {
	return asset.Group != null && asset.Group.Clothing && ShopAssetMissingAndWornForCharacter(character, asset);
}
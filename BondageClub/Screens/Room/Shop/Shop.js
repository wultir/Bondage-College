"use strict";
var ShopBackground = "Shop";
var ShopVendor = null;
var ShopCustomer = null;
var ShopVendorAllowItem = false;
var ShopBoughtEverything = false;
var ShopStarted = false;
var ShopText = "";
var ShopRescueScenario = "";
var ShopRescueScenarioList = ["BoughtEverything", "CatBurglar", "BoredVendor", "SleepingAtWork"];
var ShopItemOffset = 0;
var ShopDemoItemPayment = 0;
var ShopDemoItemGroup = "";
var ShopDemoItemGroupList = ["ItemHead", "ItemMouth", "ItemArms", "ItemLegs", "ItemFeet"];
var ShopSelectAsset = ShopAssetFocusGroup;
var ShopCart = [];

/** 
 * Checks if the vendor is restrained
 * @returns {boolean} - Returns TRUE if the vendor is restrained or gagged
 */
function ShopIsVendorRestrained() { return (ShopVendor.IsRestrained() || !ShopVendor.CanTalk()) }

/** 
 * Checks if the current rescue scenario corresponds to the given one
 * @param {string} ScenarioName - Name of the rescue scenario to check for
 * @returns {boolean} - Returns TRUE if the current rescue scenario is the given one
 */
function ShopIsRescueScenario(ScenarioName) { return (ShopRescueScenario == ScenarioName) }

/**
 * Loads the shop room and its NPC
 * @returns {void} - Nothing
 */
function ShopLoad() {

	// Creates the shop vendor always at full height to be able to click on her zones correctly
	ShopVendor = CharacterLoadNPC("NPC_Shop_Vendor");
	InventoryWear(ShopVendor, "H1000", "Height", "Default");
	ShopVendor.AllowItem = ShopVendorAllowItem;
	ShopStarted = false;
	ShopText = TextGet("SelectItemBuy");

	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "Shop") && !MaidQuartersCurrentRescueCompleted) ShopVendor.AllowItem = true;
	if ((MaidQuartersCurrentRescue == "Shop") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		InventoryWearRandom(ShopVendor, "ItemFeet");
		InventoryWearRandom(ShopVendor, "ItemLegs");
		InventoryWearRandom(ShopVendor, "ItemArms");
		InventoryWearRandom(ShopVendor, "ItemNeck");
		InventoryWearRandom(ShopVendor, "ItemMouth");
		InventoryWearRandom(ShopVendor, "ItemHead");
		ShopVendor.Stage = "MaidRescue";
		ShopRescueScenario = CommonRandomItemFromList(ShopRescueScenario, ShopRescueScenarioList);
	}

}

/**
 * Runs and draws the shop screen.
 * @returns {void} - Nothing
 */
function ShopRun() {
	
	// Draw both characters
	DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(ShopVendor, 500, 0, 1);
	if (ShopStarted && (ShopCart.length > 12)) DrawButton(1770, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (!ShopStarted) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");

	// In shopping mode
	if (ShopStarted) {
		// For each items in the assets with a value
		var X = 1000;
		var Y = 125;
		for (let A = ShopItemOffset; (A < ShopCart.length && A < ShopItemOffset + 12); A++) {
			DrawRect(X, Y, 225, 275, ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile) ? "cyan" : "white");
			if (!CharacterAppearanceItemIsHidden(ShopCart[A].Name, ShopCart[A].Group.Name)) 
                DrawImageResize("Assets/" + ShopCart[A].Group.Family + "/" + ShopCart[A].Group.Name + "/Preview/" + ShopCart[A].Name + ".png", X + 2, Y + 2, 221, 221);
			else 
                DrawImageResize("Icons/HiddenItem.png", X + 2, Y + 2, 221, 221);
			DrawTextFit(ShopCart[A].Description + " " + ShopCart[A].Value.toString() + " $", X + 112, Y + 250, 221, (InventoryAvailable(Player, ShopCart[A].Name, ShopCart[A].Group.Name)) ? "green" : "red");
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

		// Draw the header and empty text if we need too
		if (ShopText == "") ShopText = TextGet("SelectItemBuy");
		DrawText(ShopText + " (" + Player.Money.toString() + " $)", 1375, 50, "White", "Black");
		if ((X == 1000) && (Y == 125)) DrawText(TextGet("EmptyCategory"), 1500, 500, "White", "Black");

	}

}

/**
 * Checks if an asset is from the focus group and if it can be bought. An asset can be shown if it has a value greater than 0. (0 is a default item, -1 is a non-purchasable item)
 * @param {Asset} Asset - The asset to check for availability
 * @returns {boolean} - Returns TRUE if the item is purchasable and part of the focus group.
 */
function ShopAssetFocusGroup(Asset) {
	return (Asset != null) && (Asset.Group != null) && (Asset.Value > 0) && (Asset.Group.Name == ShopVendor.FocusGroup.Name);
}

/**
 * Checks if an asset can be bought. An asset is considered missing if it is not owned and has a value greater than 0. (0 is a default item, -1 is a non-purchasable item)
 * @param {Asset} Asset - The asset to check for availability
 * @returns {boolean} - Returns TRUE if the item is purchasable and unowned.
 */
function ShopAssetMissing(Asset) {
	return (Asset != null) && (Asset.Group != null) && (Asset.Value > 0) && !InventoryAvailable(Player, Asset.Name, Asset.Group.Name);
}

/**
 * Checks if an asset can be bought and is currently worn by the player. An asset is considered missing if it is not owned and has a value greater than 0. (0 is a default item, -1 is a non-purchasable item)
 * @param {Asset} asset - The asset to check for availability
 * @returns {boolean} - Returns TRUE if the item is purchasable, worn and unowned.
 */
function ShopAssetMissingAndWorn(asset) {
	if (!ShopAssetMissing(asset)) return false;
	if (InventoryIsWorn(Player, asset.Name, asset.Group.Name)) return true;
	
	// If the item isn't worn, also check if any item in the same buy group is worn.
	if (asset.BuyGroup != null)
		return Asset.some(otherAsset => ShopAssetIsInBuyGroupAndWorn(Player, otherAsset, asset.BuyGroup));

	return false;
}

/**
 * Used to display all the items the player does not own
 * @param {boolean} [OnlyWorn=false] - Optional parameter that only displays worn items
 * @returns {void} - Nothing
 */
function ShopSelectAssetMissing(OnlyWorn) {
	ShopVendor.FocusGroup = null;
	ShopItemOffset = 0;
	CurrentCharacter = null;
	ShopStarted = true;
	ShopSelectAsset = OnlyWorn ? ShopAssetMissingAndWorn : ShopAssetMissing;
	ShopText = TextGet("SelectItemBuy");
	ShopCartBuild();
}

/**
 * Click handler for the shop screen
 * @returns {void} - Nothing
 */
function ShopClick() {
	
	// Out of shopping mode, the player can click on herself, the vendor or exit
	if (!ShopStarted) {
		if ((MouseX >= 0) && (MouseX < 500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
		if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShopVendor);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("Room", "MainHall");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	} else {

		// The user can select a different body by clicking on the vendor
		if ((ShopVendor.FocusGroup != null) && (ShopVendor.FocusGroup.Category == "Item"))
			if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000))
				for (let A = 0; A < AssetGroup.length; A++)
					if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
						for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
							if ((MouseX - 500 >= AssetGroup[A].Zone[Z][0]) && (MouseY >= AssetGroup[A].Zone[Z][1] - ShopVendor.HeightModifier) && (MouseX - 500 <= AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) && (MouseY <= AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - ShopVendor.HeightModifier)) {
								ShopItemOffset = 0;
								ShopVendor.FocusGroup = AssetGroup[A];
								ShopSelectAsset = ShopAssetFocusGroup;
								ShopCartBuild();
							}

		// For each items in the assets with a value
		var X = 1000;
		var Y = 125;
		for (let A = ShopItemOffset; (A < ShopCart.length && A < ShopItemOffset + 12); A++) {
			if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {

				// If the item isn't already owned and the player has enough money, we buy it
				if (InventoryAvailable(Player, ShopCart[A].Name, ShopCart[A].Group.Name)) ShopText = TextGet("AlreadyOwned");
				else if (ShopCart[A].Value > Player.Money) ShopText = TextGet("NotEnoughMoney");
				else if (LogQuery("BlockKey", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && ((ShopCart[A].Name == "MetalCuffsKey") || (ShopCart[A].Name == "MetalPadlockKey") || (ShopCart[A].Name == "IntricatePadlockKey"))) ShopText = TextGet("CannotSellKey");
				else if (LogQuery("BlockRemote", "OwnerRule") && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (ShopCart[A].Name == "VibratorRemote" || ShopCart[A].Name == "LoversVibratorRemote")) ShopText = TextGet("CannotSellRemote");
				else {

					// Add the item and removes the money
					CharacterChangeMoney(Player, ShopCart[A].Value * -1);
					InventoryAdd(Player, ShopCart[A].Name, ShopCart[A].Group.Name, false);
					ShopText = TextGet("ThankYou");

					// Add any item that belongs in the same buy group
					if (ShopCart[A].BuyGroup != null)
						for (let B = 0; B < Asset.length; B++)
							if (ShopAssetIsInBuyGroup(Asset[B], ShopCart[A].BuyGroup))
								InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name, false);

					if (ShopCart[A].PrerequisiteBuyGroups)
						for (let B = 0; B < Asset.length; B++)
							for (let C = 0; C < ShopCart[A].PrerequisiteBuyGroups.length; C++)
								if (ShopAssetIsInBuyGroup(Asset[B], ShopCart[A].PrerequisiteBuyGroups[C]))
									InventoryAdd(Player, Asset[B].Name, Asset[B].Group.Name, false);
					
					// Sync and rebuild the shop menu to be up-to-date
					ServerPlayerInventorySync();
					ShopCartBuild();
				}

			}
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

		// Exit shopping mode
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
			ShopStarted = false;
			ShopVendor.Stage = "0";
			ShopVendor.FocusGroup = null;
			CharacterSetCurrent(ShopVendor);
			ShopVendor.CurrentDialog = TextGet("MoreShopping");
		}
		
		// If the user wants to get the next 12 items
		if ((MouseX >= 1770) && (MouseX <= 1860) && (MouseY >= 25) && (MouseY < 115)) {
			ShopItemOffset = ShopItemOffset + 12;
			if (ShopItemOffset >= ShopCart.length) ShopItemOffset = 0;
		}

	}
}

/**
 * Builds the array of items the player can buy in the current category.
 * @returns {void} - Nothing
 */
function ShopCartBuild() { 
	ShopCart = [];
	for (let A = 0; A < Asset.length; A++)
		if (ShopSelectAsset(Asset[A]))
			ShopCart.push(Asset[A]);
}
 
/**
 * Sets the current asset group the player is shopping for
 * @param {string} ItemGroup - Name of the asset group to look for
 * @returns {void} - Nothing
 */
function ShopStart(ItemGroup) {

	// Finds the asset group to shop with
	for (let A = 0; A < AssetGroup.length; A++)
		if (AssetGroup[A].Name == ItemGroup) {
			ShopVendor.FocusGroup = AssetGroup[A];
			break;
		}

	// If we have a group, we start the shop
	if (ShopVendor.FocusGroup != null) {
		ShopItemOffset = 0;
		CurrentCharacter = null;
		ShopStarted = true;
		ShopSelectAsset = ShopAssetFocusGroup;
		ShopText = TextGet("SelectItemBuy");
		ShopCartBuild();
	}

}

/**
 * Triggered when the player rescues the shop vendor
 * @returns {void} - Nothing
 */
function ShopCompleteRescue() {
	ShopVendor.AllowItem = ShopVendorAllowItem;
	CharacterRelease(ShopVendor);
	MaidQuartersCurrentRescueCompleted = true;
}

/**
 * Checks if the player bought all items that can be bought, including appearance items
 * @returns {void} - Nothing
 */
function ShopCheckBoughtEverything() {
	ShopBoughtEverything = false;
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A] != null) && (Asset[A].Group != null) && (Asset[A].Value > 0) && !InventoryAvailable(Player, Asset[A].Name, Asset[A].Group.Name))
			return;
	ShopBoughtEverything = true;
}

/**
 * Allows the player to tie the shop vendor if the player has bought everything
 * @returns {void} - Nothing
 */
function ShopVendorBondage() {
	ShopVendorAllowItem = true;
	ShopVendor.AllowItem = true;
}

/**
 * Restrains the player with a random shop item before the shop demo job starts. The customer will have a 50/50 chance of being willing to release the player
 * @returns {void} - Nothing
 */
function ShopJobRestrain() {

	// First, we find a body part where we can use the item
	DialogChangeReputation("Dominant", -1);
	while (true) {
		ShopDemoItemGroup = CommonRandomItemFromList("", ShopDemoItemGroupList);
		if ((InventoryGet(Player, ShopDemoItemGroup) == null) && !InventoryGroupIsBlocked(Player, ShopDemoItemGroup)) break;
	}

	// Add a random item on that body part and creates a customer
	InventoryWearRandom(Player, ShopDemoItemGroup, 3);
	ShopDemoItemPayment = Math.round(InventoryGet(Player, ShopDemoItemGroup).Asset.Value / 10);
	if ((ShopDemoItemPayment == null) || (ShopDemoItemPayment < 5)) ShopDemoItemPayment = 5;
	ShopCustomer = CharacterLoadNPC("NPC_Shop_Customer");
	ShopCustomer.AllowItem = false;
	ShopCustomer.Stage = ShopDemoItemGroup + "0";
	if (Math.random() >= 0.5) ShopCustomer.WillRelease = function () { return true };
	else ShopCustomer.WillRelease = function () { return false };

}

/**
 * Handles starting the shop demo job, the player is sent in an empty room with a customer
 * @returns {void} - Nothing
 */
function ShopJobStart() {
	DialogLeave();
	EmptyBackground = "Shop";
	EmptyCharacterOffset = -500;
	EmptyCharacter = [];
	EmptyCharacter.push(Player);
	EmptyCharacter.push(ShopCustomer);
	CommonSetScreen("Room", "Empty");
}

/**
 * Checks if an asset is in a specific buy group.
 * @param {Asset} asset - Asset to check the buy group of
 * @param {string} buyGroup - Buy group name
 * @return {boolean} - Returns TRUE of the two assets have the same buy group and it isn't null
 */
function ShopAssetIsInBuyGroup(asset, buyGroup) {
	return (asset != null) && (asset.BuyGroup != null) && (asset.BuyGroup == buyGroup);
}

/**
 * Checks is an item is in a specific buy group and is worn by a specific character.
 * @param {Character} character - Character to check if they have the item worn
 * @param {Asset} asset - Asset to check
 * @param {string} buyGroup - Buy group to check on the asset
 */
function ShopAssetIsInBuyGroupAndWorn(character, asset, buyGroup) {
	return ShopAssetIsInBuyGroup(asset, buyGroup) && InventoryIsWorn(character, asset.Name, asset.Group.Name);
}
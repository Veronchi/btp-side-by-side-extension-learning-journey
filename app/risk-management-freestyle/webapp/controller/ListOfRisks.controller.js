sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
],
    function (Controller, MessageToast, MessageBox, JSONModel, ODataModel) {
        "use strict";

        return Controller.extend("riskmanagementfreestyle.controller.ListOfRisks", {
            onInit() {
                this.oAppModel = new JSONModel({
                    isEditMode: false,
                    newTitle: "",
                    newOwner: "",
                    selectedRiskId: "",
                });

                this.getView().setModel(this.oAppModel, "appModel");
            },

            onTableSelectionChange() {
                this.getView().getModel("appModel").setProperty("/isEditMode", true);
            },

            async onEditBtnPress(){
                const oView = this.getView();
                const oTable = this.byId("idRisksTable");
                const oSelectedContext =  oTable.getSelectedItem().getBindingContext();
                const sId = oSelectedContext.getObject().ID;

                oView.getModel("appModel").setProperty("/selectedRiskId", sId);
    
                if (!this.oDialog) {
                    this.oDialog = await this.loadFragment({name: "riskmanagementfreestyle.view.fragments.EditRisk"});
                }
    
                this.oDialog.open();
            },

            onSaveBtnPress: async function() {
                const oModel = this.getView().getModel();
                const oTable = this.byId('idRisksTable');
                const oSelectedContext = oTable.getSelectedItem().getBindingContext();
                const sId = this.getView().getModel("appModel").getProperty("/selectedRiskId");
                const newTitle = this.getView().getModel("appModel").getProperty("/newTitle");
                const newOwner = this.getView().getModel("appModel").getProperty("/newOwner");
                const oAction = oModel.bindContext("RiskService.changeRisk(...)", oSelectedContext);
                
                oAction.setParameter("ID", sId);
                oAction.setParameter("newTitle", newTitle);
                oAction.setParameter("newOwner", newOwner);
    
                try {
                    await oAction.execute();
                    MessageToast.show("Title edited successfully!");
                    oModel.refresh();
                    this.oDialog.close();
                } catch (oError) {
                    MessageBox.alert(oError.message, {
                        icon : MessageBox.Icon.ERROR,
                        title : "Error"
                    });
                }

                this._resetState(oTable);
            },

            onCloseEditDialogPress() {
                this.oDialog.close();
                this.getView().getModel("appModel").setProperty("/newTitle", "");
                this.getView().getModel("appModel").setProperty("/newOwner", "");
            },

            _resetState(oTable) {
                oTable.removeSelections(true);
                this.getView().getModel("appModel").setProperty("/newTitle", "");
                this.getView().getModel("appModel").setProperty("/isEditMode", false);
                this.getView().getModel("appModel").setProperty("/newOwner", "");
            }
        });
    });

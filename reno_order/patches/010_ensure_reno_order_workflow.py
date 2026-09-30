import importlib

import frappe

WORKFLOW_STATES = [
	"Draft",
	"Confirmed",
	"In Production",
	"Ready for Installation",
	"Installed",
	"Closed",
	"Cancelled",
]


def execute():
	"""Ensure the Workflow State records exist, then (re)build the Reno Order workflow.

	Patches 002 and 004 assumed these Workflow States already existed, so on a fresh
	site they failed silently and were still logged as done. This patch is safe to
	run on any site: missing states are created, existing ones are left alone.
	"""
	for state in WORKFLOW_STATES:
		if not frappe.db.exists("Workflow State", state):
			frappe.get_doc({"doctype": "Workflow State", "workflow_state_name": state}).insert(
				ignore_permissions=True
			)

	importlib.import_module("reno_order.patches.002_create_reno_order_workflow").execute()
	importlib.import_module("reno_order.patches.004_add_workflow_states_transitions").execute()

# Copyright (c) 2026, Frappe and contributors
# For license information, please see license.txt

import frappe
from frappe.tests.utils import FrappeTestCase

# Do not auto-generate test records for linked doctypes (needs setup-wizard data)
test_ignore = ["Item", "UOM", "Warehouse"]


class TestRenoOrderItem(FrappeTestCase):
	pass

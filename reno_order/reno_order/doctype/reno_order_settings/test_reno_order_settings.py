# Copyright (c) 2026, Sejal Pachaghare and Contributors
# See license.txt

# IntegrationTestCase exists only in newer Frappe; v15 (used in CI) has FrappeTestCase
try:
	from frappe.tests import IntegrationTestCase as BaseTestCase
except ImportError:
	from frappe.tests.utils import FrappeTestCase as BaseTestCase


class IntegrationTestRenoOrderSettings(BaseTestCase):
	"""
	Integration tests for RenoOrderSettings.
	Use this class for testing interactions between multiple components.
	"""

	pass

// Copyright (c) 2026, Frappe and contributors
// For license information, please see license.txt

frappe.ui.form.on('Reno Order', {
	refresh(frm) {
		// Sales Order / Delivery Note / Sales Invoice are created automatically
		// as the workflow moves through Confirmed -> Ready for Installation -> Installed
		add_mark_as_installed_button(frm);
		show_missing_contact_banner(frm);
	},

	setup(frm) {
		// Dynamic filter: Contact Person / Customer Address options narrow down
		// to only records linked to the selected customer
		// (Frappe's own queries are used because link_doctype / link_name live
		// in a child table, which a plain filter cannot read)
		frm.set_query('contact_person', () => ({
			query: 'frappe.contacts.doctype.contact.contact.contact_query',
			filters: { link_doctype: 'Customer', link_name: frm.doc.customer }
		}));
		frm.set_query('customer_address', () => ({
			query: 'frappe.contacts.doctype.address.address.address_query',
			filters: { link_doctype: 'Customer', link_name: frm.doc.customer }
		}));
	},

	discount_percent(frm) {
		// Friendly client-side hint - the server (validate_discount_approval) is
		// still the real enforcement point, this just avoids a surprise error
		// after the user has filled the whole form
		if (frm.doc.discount_percent > 20) {
			frappe.show_alert({
				message: __('High discount - this may need manager approval on submit'),
				indicator: 'orange'
			});
		}
	}
});

function show_missing_contact_banner(frm) {
	// Address and contact are filled by the server on save; if the customer has
	// no primary address or contact, say so at the top of the form
	if (frm.is_new() || !frm.doc.customer) {
		return;
	}

	const missing = [];
	if (!frm.doc.customer_address) missing.push(__('primary address'));
	if (!frm.doc.contact_person) missing.push(__('primary contact'));

	if (missing.length) {
		frm.set_intro(
			__('Customer {0} has no {1}.', [frm.doc.customer, missing.join(__(' and no '))]),
			'orange'
		);
	}
}

function add_mark_as_installed_button(frm) {
	// Only show when the order is actually ready to be installed, and only
	// for users who could plausibly have permission - the server re-checks
	// this properly via the same workflow-transition logic either way
	const can_show = frm.doc.docstatus === 1 && frm.doc.status === 'Ready for Installation';

	if (!can_show) {
		return;
	}

	frm.add_custom_button(__('Mark as Installed'), () => {
		frappe.confirm(
			__('Mark this Reno Order as Installed? This will generate the Sales Invoice automatically.'),
			() => {
				frappe.call({
					method: 'reno_order.reno_order.api.update_installation_status',
					args: {
						reno_order: frm.doc.name,
						status: 'Installed'
					},
					freeze: true,
					freeze_message: __('Updating installation status...'),
					callback: (r) => {
						if (!r.exc) {
							frappe.show_alert({ message: __('Marked as Installed'), indicator: 'green' });
							frm.reload_doc();
						}
					}
				});
			}
		);
	}).addClass('btn-primary');
}

import { html, LitElement, PropertyValues } from "lit-element";
import { TemplateResult } from "lit-html";
import { IWebRouter } from "../../../../lib";
import { sharedStyles } from "../../styles";
import { data } from "./data";

function resolveSecretPasswordGuard (): Promise<boolean> {
	return new Promise(res => {
		if (data.secretPassword != null) res(true);
		setTimeout(() => {
			data.secretPassword = `1234`;
			res(true);
		}, 1000);
	});
}

export default class SecretComponent extends LitElement {

	firstUpdated (changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		const $router = this.shadowRoot!.querySelector<IWebRouter>("web-router")!;
		$router.add([
			{
				path: "code",
				component: () => import("./code/code")
			},
			{
				path: "password",
				component: () => import("./password/password"),
				guards: [resolveSecretPasswordGuard]
			},
			{
				path: "**",
				redirectTo: "code"
			}
		]);
	}

	/**
	 * Renders the component.
	 * @returns {TemplateResult}
	 */
	render (): TemplateResult {
		return html`
			<style>
				${sharedStyles}
			</style>
			<p>SecretComponent</p>
			<router-link path="code"><button>Go to CodeComponent</button></router-link>
			<router-link path="password"><button>Go to PasswordComponent (1sec delay)</button></router-link>
			<div id="child">
				<web-router></web-router>
			</div>
		`;
	}

}

window.customElements.define("secret-component", SecretComponent);

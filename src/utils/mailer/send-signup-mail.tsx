import { sendMail } from "./send-mail";

export const sendSignUpEmail = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const body = `
  <p>Hi ${name},</p>
  <br />
  <p>I’m excited to announce that the new DiversyFund Board Portal is now live!</p>
  <br />
  <p>This portal has been carefully designed to provide a centralized hub for all things related to your role as an Advisory Board member. It’s a place where you can easily access important information, submit introductions, and find valuable resources like videos, one-pagers, and other materials to support you in your work with DiversyFund.</p>
  <br />
  <p>Key Features:</p>
  <p>Introduction Submissions: A streamlined way to submit introductions and help grow our network.</p>
  <p>Deliverables & Resources: Quick access to essential materials, including videos, one-pagers, and more.</p>
  <p>Board Communication Hub: Stay informed and up to date with all board-related updates and discussions.</p>
  <p>I want to personally thank each of you for your patience as we worked hard to build something truly special. We believe this custom portal will enhance your experience as a board member and make it easier to contribute to our shared success.</p>
  <br />
  <p>You can now log in to your account and explore the portal by clicking the link below:</p>
  <p><a href="${process.env.NEXTAUTH_URL}/auth/signin" target="_blank">Sign In</a></p>
  <p>Your temporary password is: ${password}</p>
  <p>Please make sure to change your password after your first login.</p>
  <br />
  <p>If you have any trouble logging in or accessing your account, feel free to reach out for assistance.</p>
  <br />
  <p>Thank you once again for your continued support, and I look forward to seeing you engage with the portal!</p>
  <br />
  <p>Best regards</p>


  <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
  <footer style="font-size: 10px;">
    <p>Nico Valdez | Future Operations Manager / Special Projects / AI Specialist</p>
    <p>DiversyFund | The Wealth-Tech platform that enables<br />Main Street investors to build wealth like the 1%</p>
    <br />
    <p>DiversyFund</p>
    <p>750 "B" Street Suite 1930</p>
    <p>San Diego, CA 92101</p>
    <p><a target="_blank" href="http://www.diversyfund.com" style="text-decoration: none;">www.diversyfund.com</a></p>
    <br />
    <p style="font-style: italic;">Important & Confidential:</p>
    <p style="font-size: 10px;">This message and any accompanying documents contain information belonging to the sender which may be confidential and legally privileged. This information is only for the use of the individual or entity to which it was intended. If you are not the intended recipient, any disclosure, copying, distribution, or action taken in reliance on the contents of the information contained in this message and any accompanying documents is strictly prohibited. If you have received this message in error, please contact the sender immediately and delete the message.</p>
    <br />
    <p style="font-size: 10px;">DiversyFund, Inc. ("DiversyFund") operates a website at <a target="_blank" href="http://www.diversyfund.com" style="color: #666; text-decoration: none;">diversyfund.com</a> (the "Site"). By using the Site, you accept our Terms of Use and Privacy Policy. Past performance is no guarantee of future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance. All securities involve risk and may result in partial or total loss. Neither DiversyFund nor any of its affiliates provides tax advice or investment recommendations and do not represent in any manner that the outcomes described herein or on the Site will result in any particular investment or tax consequence. Prospective investors should confer with their personal tax advisors regarding the tax consequences based on their particular circumstances. Neither DiversyFund nor any of its affiliates assume responsibility for the tax consequences for any investor of any investment. This message is not a proposal to sell or the solicitation of interest in any security, which can only be made through official documents such as a private placement memorandum or a prospectus.</p>
  </footer>
  `;
  const result = await sendMail({
    to: email,
    subject: "Welcome to the New DiversyFund Board Portal!",
    body,
  });

  return { success: result.accepted.includes(email) };
};

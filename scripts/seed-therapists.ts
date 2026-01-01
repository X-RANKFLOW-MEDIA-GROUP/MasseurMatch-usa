import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}
if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// APENAS PERFIS MASCULINOS - Nomes femininos removidos
const seeds = [
  { email: "bruno+t2@example.com", fullName: "Bruno Beta", plan: "standard", planName: "Standard", status: "Active", slug: "bruno-beta-miami", subStatus: "active", phone: "+1 202-555-0102" },
  { email: "diego+t4@example.com", fullName: "Diego Delta", plan: "elite", planName: "Elite", status: "Suspended", slug: "diego-delta-nyc", subStatus: "past_due", phone: "+1 202-555-0104" },
  { email: "fabio+t6@example.com", fullName: "Fabio Zeta", plan: "standard", planName: "Standard", status: "Pending", slug: "fabio-zeta-denver", subStatus: "trialing", phone: "+1 202-555-0106" },
  { email: "hugo+t8@example.com", fullName: "Hugo Theta", plan: "elite", planName: "Elite", status: "Active", slug: "hugo-theta-sf", subStatus: "active", phone: "+1 202-555-0108" },
  { email: "joel+t10@example.com", fullName: "Joel Kappa", plan: "standard", planName: "Standard", status: "Suspended", slug: "joel-kappa-seattle", subStatus: "past_due", phone: "+1 202-555-0110" },
  { email: "marco+t11@example.com", fullName: "Marco Lambda", plan: "pro", planName: "Pro", status: "Active", slug: "marco-lambda-austin", subStatus: "active", phone: "+1 202-555-0111" },
  { email: "nathan+t12@example.com", fullName: "Nathan Sigma", plan: "free", planName: "Free", status: "Pending", slug: "nathan-sigma-chicago", subStatus: "trialing", phone: "+1 202-555-0112" },
  { email: "oliver+t13@example.com", fullName: "Oliver Omega", plan: "elite", planName: "Elite", status: "Active", slug: "oliver-omega-la", subStatus: "active", phone: "+1 202-555-0113" },
  { email: "pedro+t14@example.com", fullName: "Pedro Phi", plan: "pro", planName: "Pro", status: "Active", slug: "pedro-phi-houston", subStatus: "active", phone: "+1 202-555-0114" },
  { email: "quinn+t15@example.com", fullName: "Quinn Rho", plan: "standard", planName: "Standard", status: "Pending", slug: "quinn-rho-boston", subStatus: "trialing", phone: "+1 202-555-0115" },
];

async function main() {
  for (const user of seeds) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: "Test@123",
      email_confirm: true,
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Could not create user");

    const { error: upsertError } = await supabase.from("therapists").upsert({
      user_id: userId,
      full_name: user.fullName,
      email: user.email,
      status: user.status,
      plan: user.plan,
      plan_name: user.planName,
      subscription_status: user.subStatus,
      slug: user.slug,
      phone: user.phone,
    });

    if (upsertError) throw upsertError;

    console.log("Seeded", user.email);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

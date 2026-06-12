import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeWithRelations } from "@/types/resume";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#18181b" },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", textAlign: "center" },
  contact: { fontSize: 9, color: "#52525b", textAlign: "center", marginTop: 4 },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#7c3aed",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#52525b", fontSize: 9 },
  bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 8 },
  bulletText: { flex: 1 },
  itemBlock: { marginBottom: 8 },
});

export function ResumeDocument({ resume }: { resume: ResumeWithRelations }) {
  const contact = [resume.email, resume.phone, resume.location, resume.website]
    .filter(Boolean)
    .join("   |   ");

  return (
    <Document title={resume.title} author={resume.fullName ?? undefined}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{resume.fullName || "Your Name"}</Text>
        {contact ? <Text style={styles.contact}>{contact}</Text> : null}

        {resume.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{resume.summary}</Text>
          </View>
        ) : null}

        {resume.experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experiences.map((exp) => (
              <View key={exp.id} style={styles.itemBlock}>
                <View style={styles.row}>
                  <Text style={styles.bold}>
                    {exp.role} · {exp.company}
                  </Text>
                  <Text style={styles.muted}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "—"}
                  </Text>
                </View>
                {exp.bullets.map((bullet, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text>•  </Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {resume.educations.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.educations.map((edu) => (
              <View key={edu.id} style={styles.row}>
                <Text>
                  <Text style={styles.bold}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  {"  ·  "}
                  {edu.school}
                </Text>
                <Text style={styles.muted}>
                  {edu.startYear || ""}{edu.startYear || edu.endYear ? " – " : ""}{edu.endYear || ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {resume.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{resume.skills.map((skill) => skill.name).join("  ·  ")}</Text>
          </View>
        ) : null}

        {resume.projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((project) => (
              <View key={project.id} style={styles.itemBlock}>
                <Text style={styles.bold}>
                  {project.name}
                  {project.tech.length > 0 ? (
                    <Text style={styles.muted}> — {project.tech.join(", ")}</Text>
                  ) : null}
                </Text>
                {project.description ? <Text>{project.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

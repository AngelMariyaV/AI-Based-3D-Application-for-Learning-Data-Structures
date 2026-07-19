import { FaLightbulb, FaCogs, FaListUl, FaGlobeAmericas, FaCommentDots } from "react-icons/fa";

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-indigo-500" />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 leading-relaxed pl-6">{children}</div>
    </div>
  );
}

function Theory({ theory }) {
  if (!theory) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <Section icon={FaLightbulb} title="Definition">
        <p>{theory.definition}</p>
      </Section>

      <Section icon={FaCogs} title="How it works">
        <p>{theory.working}</p>
      </Section>

      <Section icon={FaListUl} title="Core operations">
        <ul className="list-disc pl-5 space-y-1">
          {theory.operations.map((op) => (
            <li key={op}>{op}</li>
          ))}
        </ul>
      </Section>

      <Section icon={FaCogs} title="Time complexity">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Operation</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {theory.complexity.map((row) => (
                <tr key={row.op} className="border-b last:border-0">
                  <td className="py-2 pr-4">{row.op}</td>
                  <td className="py-2">
                    <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      {row.time}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={FaGlobeAmericas} title="Real-life example">
        <p>{theory.realWorld}</p>
      </Section>

      {theory.interviewTip && (
        <Section icon={FaCommentDots} title="Interview tip">
          <p>{theory.interviewTip}</p>
        </Section>
      )}
    </div>
  );
}

export default Theory;

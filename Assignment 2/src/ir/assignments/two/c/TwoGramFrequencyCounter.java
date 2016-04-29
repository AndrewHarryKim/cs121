package ir.assignments.two.c;

import ir.assignments.two.a.Frequency;
import ir.assignments.two.a.Utilities;
import ir.assignments.two.b.WordFrequencyCounter;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Count the total number of 2-grams and their frequencies in a text file.
 */
public final class TwoGramFrequencyCounter {
	/**
	 * This class should not be instantiated.
	 */
	private TwoGramFrequencyCounter() {}
	
	/**
	 * Takes the input list of words and processes it, returning a list
	 * of {@link Frequency}s.
	 * 
	 * This method expects a list of lowercase alphanumeric strings.
	 * If the input list is null, an empty list is returned.
	 * 
	 * There is one frequency in the output list for every 
	 * unique 2-gram in the original list. The frequency of each 2-grams
	 * is equal to the number of times that two-gram occurs in the original list. 
	 * 
	 * The returned list is ordered by decreasing frequency, with tied 2-grams sorted
	 * alphabetically. 
	 * 
	 * 
	 * 
	 * Example:
	 * 
	 * Given the input list of strings 
	 * ["you", "think", "you", "know", "how", "you", "think"]
	 * 
	 * The output list of 2-gram frequencies should be 
	 * ["you think:2", "how you:1", "know how:1", "think you:1", "you know:1"]
	 *  
	 * @param words A list of words.
	 * @return A list of two gram frequencies, ordered by decreasing frequency.
	 */
	private static List<Frequency> computeTwoGramFrequencies(ArrayList<String> words) {
		//To save computation
		if(words==null || words.size()<=1)
			return null;
		
		List<String> tmp = new ArrayList<String>(words.size() - 1);
		
		for (int i = 1; i < words.size(); ++i) 
			tmp.add(words.get(i - 1) + " " + words.get(i));
		
		// Making an assumption that this class is available
		return WordFrequencyCounter.computeWordFrequencies(tmp);
	}
	private static List<Frequency> computeNGramFrequencies(ArrayList<String> words,int n) {
		//To save computation
		if(words==null || words.size()<=n-1)
			return null;
		
		List<String> tmp = new ArrayList<String>(words.size() - (n-1));
		
		for (int i = n-1; i < words.size(); ++i) 
			tmp.addAll(getStringsToAdd(words,n,i));
		
		// Making an assumption that this class is available
		return WordFrequencyCounter.computeWordFrequencies(tmp);
	}
	public static List<String> findNGramItems(ArrayList<String> words,int n) {
		//To save computation
		if(words==null || words.size()<=n-1)
			return null;
		
		List<String> tmp = new ArrayList<String>(words.size() - (n-1));
		
		for (int i = n-1; i < words.size(); ++i) 
			tmp.addAll(getStringsToAdd(words,n,i));
		
		// Making an assumption that this class is available
		return tmp;
	}
	private static List<String> getStringsToAdd(ArrayList<String> words,int n,int i)
	{
		//i is the current location of traversal
		List<String> listOfOutput=new ArrayList<String>();
		StringBuilder out=new StringBuilder(words.get(i-(n-1)));
		listOfOutput.add(out.toString());
		for (int q = i-(n-2); q<=words.size()-n; ++q)
		{
			
			out.append(" "+(words.get(q)));
			listOfOutput.add(out.toString());
		}
		//System.out.println(listOfOutput);
		return listOfOutput;
		
	}
	/**
	 * Runs the 2-gram counter. The input should be the path to a text file.
	 * 
	 * @param args The first element should contain the path to a text file.
	 */
	public static void main(String[] args) {
		File file = new File(args[0]);
		ArrayList<String> words = Utilities.tokenizeFile(file);
//		List<Frequency> frequencies = computeTwoGramFrequencies(words);
//		Utilities.printFrequencies(frequencies);
		List<String> frequencies2 = findNGramItems(words, 1);
		
//		Utilities.printFrequencies(frequencies2);
		System.out.println(frequencies2);
	}
}
